const { dialog } = require('electron'),
	isDev = require('electron-is-dev'),
	{ verifyExecPassword } = require('../utils/activeDirectoryLookup'),
	{ requestDirectoryInfo } = require('../utils/isuDirectoryLookup'),
	{ hasMemberInfoChanged } = require('../utils/memberUtil'),
	{ isValidEventId } = require('../utils/validation'),
	{ ipcMysql, ipcGeneral } = require('./ipcActions'),
	{ FREE_MEETING_USED, PAID_1_SEMESTER, PAID_2_SEMESTERS, MEMBER_ADDED, INFORMATION_UPDATED } =
		require('../sql/sqlConstants');

const sqlActions = (mysql, logger) => ({
	[ipcMysql.RETRIEVE_EVENTS_TODAY]: async () => {
		try {
			return await mysql.findEventsToday();
		} catch (error) {
			const errorMessage = 'Error while retrieving events for today';
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.CREATE_EVENT]: async ipcArgs => {
		const eventName = ipcArgs.eventName.trim();
		try {
			const results = await mysql.createEvent(eventName);
			return results.insertId;
		} catch (error) {
			const errorMessage = `Error while adding event '${eventName}'`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.DELETE_EVENT]: async ipcArgs => {
		const {eventId} = ipcArgs;
		try {
			isValidEventId(eventId);
			await mysql.deleteEvent(eventId);
			dialog.showMessageBox({
				type: 'info',
				message: 'Event Deleted',
				detail: 'Successfully deleted event.',
				buttons: ['Ok'],
				defaultId: 0,
				cancelId: 0
			});
			return eventId;
		} catch (error) {
			let errorMessage = `Error while deleting event with ID '${ipcArgs.eventId}'`;
			if (error.code === 'ER_ROW_IS_REFERENCED_2') {
				errorMessage += '. Cannot delete an event people have checked into.';
				logger.notify(errorMessage);
				return ipcGeneral.ACTION_NOT_PERFORMED;
			}
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.RETRIEVE_EVENT_BY_ID]: async ipcArgs => {
		const {eventId} = ipcArgs;
		let results;
		try {
			isValidEventId(eventId);
			results = await mysql.retrieveEventData(eventId);
		} catch (error) {
			const errorMessage = `Error while retrieving event data for Event ID '${eventId}'`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
		if (results && results.length) {
			return results[0];
		} else {
			const errorMessage = `Unable to find Event ID '${eventId}'`;
			logger.error(null, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.VERIFY_CREDENTIALS]: async ipcArgs => {
		if (process.argv[2] === 'offline') {
			return {
				devToolsEnabled: true,
				userId: 'dev',
				accessLevel: 'exec-admin'
			};
		}
		const netid = ipcArgs.netid.trim();
		let results;
		try {
			results = await mysql.verifyCredentials(netid);
		} catch (error) {
			const errorMessage1 = `Error verifying credentials for user '${netid}'`;
			logger.error(error, errorMessage1, true);
			throw new Error(errorMessage1);
		}
		if (results && results.length) {
			try {
				await verifyExecPassword(netid, ipcArgs.password);
			} catch (error) {
				if (error.name === 'InvalidCredentialsError') {
					return;
				}
				const errorMessage2 = `Error verifying password for user '${netid}'`;
				logger.error(error, errorMessage2, true);
				throw new Error(errorMessage2);
			}
			const {admin} = results[0];
			return {
				userId: netid,
				accessLevel: isDev || Boolean(admin) ? 'exec-admin' : 'exec'
			};
		}
	},
	[ipcMysql.LOOKUP_NETID]: async ipcArgs => {
		const netid = ipcArgs.netid.trim();
		try {
			const [members, attendance, activity] = await Promise.all([
				mysql.lookupNetid(netid),
				mysql.retrieveMemberAttendance(netid),
				mysql.retrieveMemberActivity(netid)
			]);
			if (members && members[0] && members[0].hasOwnProperty('netid')) {
				const member = members[0];
				member.attendance = attendance;
				member.activity = activity;
				if (member.last_updated) {
					const lastUpdated = new Date(member.last_updated);
					const sixMonthsAgo = new Date();
					sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
					if (lastUpdated < sixMonthsAgo) {
						member.isUpdated = true;
						try {
							const directoryInfo = await requestDirectoryInfo(netid);
							if (hasMemberInfoChanged(member, directoryInfo)) {
								return Object.assign(member, directoryInfo);
							}
						} catch (error) {
							logger.error(`Error getting directory info for Net-ID '${netid}'. Did not update member info.`);
						}
					}
				}
				return member;
			}
		} catch (error) {
			const errorMessage = `Error looking up person with Net-ID '${netid}'`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.UPDATE_MEMBER]: async ipcArgs => {
		const eventId = ipcArgs.eventId;
		const member = Object.assign(ipcArgs.member, {
			netid: ipcArgs.member.netid.trim(),
			first_name: ipcArgs.member.first_name.trim(),
			last_name: ipcArgs.member.last_name.trim(),
			major: ipcArgs.member.major.trim()
		});
		const isCheckIn = Boolean(eventId);
		try {
			const sqlCommands = [];
			let memberNeedsUpdating = false;
			const paymentActivity = _getPaymentActivity(member.payment);
			if (isCheckIn) {
				sqlCommands.push(mysql.checkInMember(member, eventId));
			}
			if (paymentActivity) {
				sqlCommands.push(mysql.recordMemberActivity(member.netid, paymentActivity));
				memberNeedsUpdating = true;
			} else if (isCheckIn && _didUseFreeMeeting(member)) {
				sqlCommands.push(mysql.recordMemberActivity(member.netid, FREE_MEETING_USED));
				member.free_meeting_used = 1;
				memberNeedsUpdating = true;
			}
			if (member.isUpdated) {
				sqlCommands.push(mysql.recordMemberActivity(member.netid, INFORMATION_UPDATED));
				memberNeedsUpdating = true;
			}
			if (memberNeedsUpdating) {
				sqlCommands.push(mysql.updateMemberInfo(member));
			}
			if (sqlCommands.length) {
				await Promise.all(sqlCommands);
			}
		} catch (error) {
			const {netid} = member;
			let errorMessage;
			if (error.code === 'ER_DUP_ENTRY') {
				logger.notify(`Member '${netid}' has already checked in for event with Event ID '${eventId}'.`);
				return ipcGeneral.ACTION_NOT_PERFORMED;
			} else if (isCheckIn) {
				errorMessage = `Error checking in member with Net-ID '${netid}' for event with Event ID '${eventId}'.`;
			} else {
				errorMessage = `Error updating member with Net-ID '${netid}'.`;
			}
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.CREATE_MEMBER]: async ipcArgs => {
		const eventId = ipcArgs.eventId;
		const member = Object.assign(ipcArgs.member, {
			netid: ipcArgs.member.netid.trim(),
			first_name: ipcArgs.member.first_name.trim(),
			last_name: ipcArgs.member.last_name.trim(),
			major: ipcArgs.member.major.trim()
		});
		const isCheckIn = Boolean(eventId);
		try {
			await mysql.createMember(member);
			const sqlCommands = [mysql.recordMemberActivity(member.netid, MEMBER_ADDED)];
			const paymentActivity = _getPaymentActivity(member.payment);
			if (paymentActivity) {
				sqlCommands.push(mysql.recordMemberActivity(member.netid, paymentActivity));
			}
			if (isCheckIn) {
				sqlCommands.push(mysql.checkInMember(member, eventId));
			}
			await Promise.all(sqlCommands);
		} catch (error) {
			let errorMessage = `Error while creating member with Net-ID '${member.netid}'`;
			if (error.code === 'ER_DUP_ENTRY') {
				errorMessage +=  '. Member already exists in database.';
				logger.notify(errorMessage);
				return ipcGeneral.ACTION_NOT_PERFORMED;
			} else if (isCheckIn) {
				errorMessage += ` and checking in for event with Event ID '${eventId}'.`;
			}
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.RETRIEVE_ATTENDANCE]: async ipcArgs => {
		const {eventId} = ipcArgs;
		try {
			isValidEventId(eventId);
			const [attendance, majorStats, classificationStats] = await Promise.all([
				mysql.getAttendanceForEvent(eventId),
				mysql.getEventMajorStats(eventId),
				mysql.getEventClassificationStats(eventId)
			]);
			return {attendance, majorStats, classificationStats};
		} catch (error) {
			const errorMessage = `Error while getting event attendance info for event with Event ID '${eventId}'`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.FIND_EVENTS]: async ipcArgs => {
		const {dateRangeStart, dateRangeEnd} = ipcArgs;
		const eventName = ipcArgs.eventName.trim();
		try {
			return await mysql.queryEvents(dateRangeStart, dateRangeEnd, eventName);
		} catch (error) {
			const errorMessage = `Error while finding events between '${dateRangeStart}' and '${dateRangeEnd}' with event name '${eventName}'`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	'default': action => {
		const errorMessage = `Invalid SQL action '${action}'`;
		logger.error(null, errorMessage);
		throw new Error(errorMessage);
	}
});

module.exports = sqlActions;

const _getPaymentActivity = payment => {
	switch (payment) {
		case 1: return PAID_1_SEMESTER;
		case 2: return PAID_2_SEMESTERS;
		default: return 0;
	}
};

const _didUseFreeMeeting = member => {
	return member.semesters_remaining === 0 && member.payment === 0;
};
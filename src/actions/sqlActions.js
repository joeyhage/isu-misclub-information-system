const { dialog } = require('electron'),
	{ verifyExecPassword } = require('../utils/activeDirectoryLookup'),
	{ ipcMysql } = require('./ipcActions'),
	{FREE_MEETING_USED, PAID_1_SEMESTER, PAID_2_SEMESTERS, MEMBER_ADDED, INFORMATION_UPDATED} =
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
		try {
			const results = await mysql.createEvent(ipcArgs.eventName);
			return results.insertId;
		} catch (error) {
			const errorMessage = `Error while adding event: ${ipcArgs.eventName}`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.DELETE_EVENT]: async ipcArgs => {
		const {eventId} = ipcArgs;
		try {
			_isValidEventId(eventId);
			await mysql.deleteEvent(eventId);
			dialog.showMessageBox({
				type: 'info',
				message: 'Event Deleted',
				detail: `Successfully deleted event with ID: ${eventId}`,
				buttons: ['Ok'],
				defaultId: 0,
				cancelId: 0
			});
			return eventId;
		} catch (error) {
			const errorMessage = `Error while deleting event with ID: ${ipcArgs.eventId}`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.RETRIEVE_EVENT_BY_ID]: async ipcArgs => {
		const {eventId} = ipcArgs;
		let results;
		try {
			_isValidEventId(eventId);
			results = await mysql.retrieveEventData(eventId);
		} catch (error) {
			const errorMessage = `Error while retrieving event data for Event ID: ${eventId}`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
		if (results && results.length) {
			return results[0];
		} else {
			const errorMessage = `Unable to find Event ID: ${eventId}`;
			logger.error(null, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.VERIFY_CREDENTIALS]: async ipcArgs => {
		const {netid} = ipcArgs;
		let results;
		try {
			results = await mysql.verifyCredentials(netid);
		} catch (error) {
			const errorMessage1 = `Error verifying credentials for user: ${netid}`;
			logger.error(error, errorMessage1, true);
			throw new Error(errorMessage1);
		}
		if (results && results.length) {
			try {
				await verifyExecPassword(netid, ipcArgs.password);
			} catch (error) {
				const errorMessage2 = `Error verifying password for user: ${netid}`;
				logger.error(error, errorMessage2, true);
				throw new Error(errorMessage2);
			}
			const {admin} = results[0];
			return {
				devToolsEnabled: Boolean(admin),
				userId: netid,
				accessLevel: Boolean(admin) ? 'exec-admin' : 'exec'
			};
		}
	},
	[ipcMysql.LOOKUP_NETID]: async ipcArgs => {
		const {netid} = ipcArgs;
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
				return member;
			} else {
				return {};
			}
		} catch (error) {
			const errorMessage = `Error looking up person with Net-ID: ${netid}`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.CHECK_IN_UPDATE_MEMBER]: async ipcArgs => {
		const {member, eventId} = ipcArgs;
		try {
			_isValidEventId(eventId);
			const sqlCommands = [
				mysql.checkInMember(member, eventId)
			];
			let memberNeedsUpdating = false;
			const paymentActivity = _getPaymentActivity(member.payment);
			if (paymentActivity) {
				sqlCommands.push(mysql.recordMemberActivity(member.netid, paymentActivity));
				memberNeedsUpdating = true;
			} else if (_didUseFreeMeeting(member)) {
				sqlCommands.push(mysql.recordMemberActivity(member.netid, FREE_MEETING_USED));
				member.free_meeting_used = 1;
				memberNeedsUpdating = true;
			}
			if (member.updatedInfo) {
				sqlCommands.push(mysql.recordMemberActivity(member.netid, INFORMATION_UPDATED));
				memberNeedsUpdating = true;
			}
			if (memberNeedsUpdating) {
				sqlCommands.push(mysql.updateMemberInfo(member));
			}
			return await Promise.all([sqlCommands]);
		} catch (error) {
			let errorMessage;
			if (error.message && error.message.includes(mysql.ER_DUP_ENTRY)) {
				errorMessage = `Error while checking in person with Net-ID: ${member.netid}. Person has already checked in for event with Event ID: ${eventId}.`;
			} else {
				errorMessage = `Error while checking in person with Net-ID: ${member.netid} for event with Event ID: ${eventId}.`;
			}
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.CHECK_IN_CREATE_MEMBER]: async ipcArgs => {
		const {member, eventId} = ipcArgs;
		try {
			_isValidEventId(eventId);
			await mysql.createMember(member);
			const sqlCommands = [
				mysql.checkInMember(member, eventId),
				mysql.recordMemberActivity(member.netid, MEMBER_ADDED),
				mysql.recordMemberActivity(member.netid, FREE_MEETING_USED)
			];
			const paymentActivity = _getPaymentActivity(member.payment);
			if (paymentActivity) {
				sqlCommands.push(mysql.recordMemberActivity(member.netid, paymentActivity));
			}
			return await Promise.all(sqlCommands);
		} catch (error) {
			let errorMessage;
			if (error.message && error.message.includes(mysql.ER_DUP_ENTRY)) {
				errorMessage = `Error while checking in person with Net-ID: ${member.netid}. Person has already checked in for event with Event ID: ${eventId}.`;
			} else {
				errorMessage = `Error while checking in person with Net-ID: ${member.netid} for event with Event ID: ${eventId}.`;
			}
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.RETRIEVE_ATTENDANCE]: async ipcArgs => {
		const {eventId} = ipcArgs;
		try {
			_isValidEventId(eventId);
			return await mysql.getAttendanceForEvent(eventId);
		} catch (error) {
			const errorMessage = `Error while getting event attendance info for event with Event ID: ${eventId}`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	[ipcMysql.FIND_EVENTS]: async ipcArgs => {
		const {dateRangeStart, dateRangeEnd, eventName} = ipcArgs;
		try {
			return await mysql.queryEvents(dateRangeStart, dateRangeEnd, eventName);
		} catch (error) {
			const errorMessage = `Error while finding events between ${dateRangeStart} and ${dateRangeEnd} with event name ${eventName}`;
			logger.error(error, errorMessage, true);
			throw new Error(errorMessage);
		}
	},
	'default': action => {
		const errorMessage = `Invalid SQL action: ${action}`;
		logger.error(null, errorMessage);
		throw new Error(errorMessage);
	}
});

module.exports = sqlActions;

const _isValidEventId = eventId => {
	if (!parseInt(eventId, 10)) {
		throw new Error(`Event ID: ${eventId} is not numeric`);
	}
};

const _getPaymentActivity = payment => {
	if (payment !== 0) {
		return payment === 1 ? PAID_1_SEMESTER : PAID_2_SEMESTERS;
	} else {
		return 0;
	}
};

const _didUseFreeMeeting = member => {
	return member.semesters_remaining === 0 && member.payment === 0;
};
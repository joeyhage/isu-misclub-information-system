const { dialog } = require('electron'),
	{ verifyExecPassword } = require('../utils/activeDirectoryLookup'),
	{ ipcMysql } = require('./ipcActions');

exports.sqlActions = (mysql, logger) => ({
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
			checkEventId(eventId);
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
			checkEventId(eventId);
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
			checkEventId(eventId);
			return await Promise.all([
				mysql.checkInMember(member, eventId)
			]);
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

	},
	[ipcMysql.RETRIEVE_ATTENDANCE]: async ipcArgs => {
		const {eventId} = ipcArgs;
		try {
			checkEventId(eventId);
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

const checkEventId = eventId => {
	if (!parseInt(eventId, 10)) {
		throw new Error(`Event ID: ${eventId} is not numeric`);
	}
};
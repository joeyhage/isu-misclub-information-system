const { dialog } = require('electron'),
	{ verifyExecPassword } = require('../utils/activeDirectoryLookup'),
	{ ipcMysql } = require('../actions/ipcActions');

exports.sqlActions = (mysql, logger) => ({
	[ipcMysql.RETRIEVE_EVENTS_TODAY]: async () => {
		try {
			return await mysql.findEventsToday();
		} catch (error) {
			logger.error(error, 'Error while retrieving events for today', true);
		}
	},
	[ipcMysql.CREATE_EVENT]: async ipcArgs => {
		try {
			const results = await mysql.createEvent(ipcArgs.eventName);
			return results.insertId;
		} catch (error) {
			logger.error(error, `Error while adding event: ${ipcArgs.eventName}`, true);
		}
	},
	[ipcMysql.DELETE_EVENT]: async ipcArgs => {
		const {eventId} = ipcArgs;
		try {
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
			logger.error(error, `Error while deleting event with ID: ${ipcArgs.eventId}`, true);
		}
	},
	[ipcMysql.RETRIEVE_EVENT_BY_ID]: async ipcArgs => {
		const {eventId} = ipcArgs;
		let results;
		try {
			results = await mysql.retrieveEventData(eventId);
		} catch (error) {
			logger.error(error, `Error while retrieving event data for event ID: ${eventId}`, true);
		}
		if (results && results.length) {
			return results[0];
		} else {
			logger.error(null, `Unable to find event ID: ${eventId}`, true);
		}
	},
	[ipcMysql.VERIFY_CREDENTIALS]: async ipcArgs => {
		const {netid} = ipcArgs;
		let results;
		try {
			results = await mysql.verifyCredentials(netid);
		} catch (error) {
			logger.error(error, `Error verifying credentials for user: ${netid}`, true);
		}
		if (results && results.length) {
			let auth;
			try {
				auth = await verifyExecPassword(netid, ipcArgs.password);
			} catch (error) {
				logger.error(error, `Error verifying password for user: ${netid}`, true);
			}
			if (auth) {
				const {admin} = results[0];
				return {
					devToolsEnabled: Boolean(admin),
					userId: netid,
					accessLevel: admin ? 'exec-admin' : 'exec'
				};
			}
		}
	},
	[ipcMysql.LOOKUP_NETID]: async ipcArgs => {
		const {netid} = ipcArgs;
		try {
			return await Promise.all([
				mysql.lookupNetid(netid),
				mysql.retrieveMemberAttendance(netid),
				mysql.retrieveMemberActivity(netid)
			]);
		} catch (error) {
			logger.error(error, `Error looking up person with Net-ID: ${netid}`, true);
		}
	},
	[ipcMysql.CHECK_IN_UPDATE_MEMBER]: async ipcArgs => {
		const {member, eventId} = ipcArgs;
		try {
			return await Promise.all([
				mysql.checkInMember(member, eventId)
			]);
		} catch (error) {
			if (error.message && error.message.includes(mysql.ER_DUP_ENTRY)) {
				logger.error(
					error,
					`Error while checking in person with Net-ID: ${member.netid}. 
					Person has already checked in for event with eventId: ${eventId}.`,
					true
				);
			} else {
				logger.error(error, `Error while checking in person with Net-ID: ${member.netid}`, true);
			}
		}
	},
	[ipcMysql.CHECK_IN_CREATE_MEMBER]: async ipcArgs => {

	},
	[ipcMysql.RETRIEVE_ATTENDANCE]: async ipcArgs => {
		const {eventId} = ipcArgs;
		try {
			return await mysql.getAttendanceForEvent(eventId);
		} catch (error) {
			logger.error(error, `Error while getting event attendance info for event with eventid: ${eventId}`, true);
		}
	},
	[ipcMysql.FIND_EVENTS]: async ipcArgs => {
		const {dateRangeStart, dateRangeEnd, eventName} = ipcArgs;
		try {
			return await mysql.queryEvents(dateRangeStart, dateRangeEnd, eventName);
		} catch (error) {
			logger.error(error, `'Error while finding events between ${dateRangeStart} and ${dateRangeEnd} with event name ${eventName}`, true);
		}
	},
	'default': action => {
		logger.error(null, `Invalid SQL action: ${action}`);
	}
});
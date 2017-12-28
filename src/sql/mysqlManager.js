const mysql = require('mysql'),
	mysqlDB = require('./mysqlDB');

class mysqlManager {
	constructor() {
		this.pool = mysql.createPool(mysqlDB);
		this.ER_DUP_ENTRY = 'ER_DUP_ENTRY';
	}

	sqlQueryHandler(sqlStatement, sqlParams) {
		return new Promise((resolve, reject) => {
			this.pool.getConnection((error, connection) => {
				if (error) {
					return reject(error);
				}
				if (sqlStatement) {
					connection.query(
						sqlStatement,
						sqlParams,
						(error, results) => {
							connection.release();
							if (error) {
								return reject(error);
							}
							resolve(results);
						}
					);
				} else {
					resolve();
				}
			});
		});
	}

	findEventsToday() {
		return this.sqlQueryHandler(
			'SELECT * FROM `is_events` WHERE `event_date`=CURRENT_DATE ORDER BY `event_id` DESC'
		);
	}

	createEvent(eventName) {
		return this.sqlQueryHandler(
			'INSERT INTO `is_events` (`event_name`,`event_date`) VALUES (?,CURRENT_DATE)',
			[eventName]
		);
	}

	deleteEvent(eventId) {
		return this.sqlQueryHandler(
			'DELETE FROM `is_events` WHERE `event_id`=?',
			[eventId]
		);
	}

	retrieveEventData(eventId) {
		return this.sqlQueryHandler(
			'SELECT `event_id`,`event_name`,DATE_FORMAT(`event_date`,\'%b %e, %Y\') as event_date ' +
			'FROM `is_events` WHERE `event_id`=?',
			[eventId]
		);
	}

	verifyCredentials(netid) {
		return this.sqlQueryHandler(
			'SELECT * FROM `is_acl` WHERE `netid`=?',
			[netid]
		);
	}

	lookupNetid(netid) {
		return this.sqlQueryHandler(
			'SELECT * FROM `is_members` WHERE `netid`=?',
			[netid]
		);
	}

	retrieveMemberAttendance(netid) {
		return this.sqlQueryHandler(
			'SELECT e.`event_id`,`event_name`,DATE_FORMAT(`event_date`,\'%b %e, %Y\') as event_date ' +
			'FROM `is_events` e,`is_attendance` a WHERE e.`event_id`=a.`event_id` AND `netid`=? ' +
			'ORDER BY e.`event_id` DESC',
			[netid]
		);
	}

	retrieveMemberActivity(netid) {
		return this.sqlQueryHandler(
			'SELECT `activity_type`,DATE_FORMAT(`timestamp`,\'%l:%i%p %b %e, %Y\') as activity_time ' +
			'FROM `is_activity_history` WHERE `netid`=? ORDER BY `timestamp` DESC',
			[netid]
		);
	}

	checkInMember(member, eventId) {
		return this.sqlQueryHandler(
			'INSERT INTO `is_attendance` (`netid`,`event_id`,`major`,`classification`) VALUES (?,?,?,?)',
			[member.netid, eventId, member.major, member.classification]
		);
	}

	addPersonInfo(member) {
		return this.sqlQueryHandler(
			'INSERT INTO `is_members` (`netid`,`first_name`,`last_name`,`major`,`classification`,`semesters_remaining`,' +
			'`free_meeting_used`) VALUES (?,?,?,?,?,?,?)',
			[member.netid, member.firstName, member.lastName, member.major, member.classification, member.semestersRemaining, 1]
		);
	}

	updateMemberInfo(member) {
		return this.sqlQueryHandler(
			'UPDATE `is_members` SET `first_name`=?,`last_name`=?,' +
			'`major`=?,`classification`=?,`semesters_remaining`=(`semesters_remaining`+?),`free_meeting_used`=? ' +
			'WHERE `netid`=?',
			[member.first_name, member.last_name, member.major, member.classification, member.payment, member.free_meeting_used, member.netid]
		);
	}

	getAttendanceForEvent(eventId) {
		return this.sqlQueryHandler(
			'SELECT m.* FROM `is_members` m, `is_attendance` a WHERE m.`netid`=a.`netid` AND `event_id`=? ORDER BY `netid` ASC',
			[eventId]
		);
	}

	queryEvents(dateRangeStart, dateRangeEnd, eventName = '') {
		return this.sqlQueryHandler(
			'SELECT `event_id`,`event_name`,DATE_FORMAT(`event_date`,\'%b %e, %Y\') as event_date ' +
			'FROM `is_events` WHERE `event_date`>=? AND `event_date`<=? AND `event_name` LIKE ? ' +
			'ORDER BY `event_id` DESC',
			[dateRangeStart, dateRangeEnd, `%${eventName}%`]
		);
	}
}

module.exports = mysqlManager;

//
// function checkIn(memberData, callback) {
// 	const netId = memberData.netid;
// 	if (!currentEventId) {
// 		winston.error('Event ID was 0 while trying to check-in member: ' + netId);
// 		app.quit();
// 	} else {
// 		connection.query('INSERT INTO `is_attendance` (`netid`, `event_id`, `first_name`, `last_name`, `major`, ' +
// 			'`classification`) VALUES (?, ?, ?, ?, ?, ?)', [netId, currentEventId, memberData.first_name, memberData.last_name,
// 				memberData.major, memberData.classification],
// 			error => {
// 				if (error) {
// 					if (error.message.indexOf('ER_DUP_ENTRY') !== -1) {
// 						dialog.showErrorBox('Error', 'Member with Net-ID: ' + netId + ' has already checked in for event: '
// 							+ currentEventId);
// 					} else {
// 						dialog.showErrorBox('Error', 'Error while trying to check-in member with Net-ID: ' + netId +
// 							' for event: ' + currentEventId);
// 						winston.error(error);
// 					}
// 				}
// 				callback();
// 			})
// 	}
// }
//
// function updateMember(memberData, callback) {
// 	const memberDataKeys = Object.keys(memberData);
// 	let memberStatusChange = false;
// 	for (let i = 0; i < memberDataKeys.length; i++) {
// 		const oldValue = currentMember[memberDataKeys[i]];
// 		const newValue = memberData[memberDataKeys[i]];
// 		let activityType;
// 		if (memberDataKeys[i] === 'semesters_remaining') {
// 			const oldInt = parseInt(oldValue, 10);
// 			const newInt = parseInt(newValue, 10);
// 			if (oldInt !== newInt) {
// 				if (newInt - oldInt === 2) {
// 					activityType = 'Paid 2 Semesters'
// 				} else {
// 					activityType = 'Paid 1 Semester'
// 				}
// 			}
// 		} else if (memberDataKeys[i] === 'free_meeting_used') {
// 			if (parseInt(oldValue, 10) !== parseInt(newValue, 10)) {
// 				activityType = 'Free Meeting Used';
// 			}
// 		}
// 		if (activityType) {
// 			memberStatusChange = true;
// 			recordMemberActivity(memberData.netid, activityType);
// 		}
// 	}
// 	if (memberStatusChange) {
// 		connection.query('UPDATE `is_members` SET `semesters_remaining`=?,`free_meeting_used`=? WHERE `netid`=?',
// 			[memberData.semesters_remaining, memberData.free_meeting_used, memberData.netid], error => {
// 				if (error) {
// 					winston.error(error);
// 					dialog.showErrorBox('Error', 'Error while trying to update member status: ' + JSON.stringify(memberData));
// 				}
// 				callback();
// 			})
// 	} else {
// 		callback();
// 	}
//
// }
//
//
// function recordMemberActivity(netId, activityType) {
// 	connection.query('INSERT INTO `is_activity_history` (`netid`,`activity_type`) VALUES (?,?)', [netId, activityType],
// 		error => {
// 			if (error) {
// 				winston.error(error);
// 				dialog.showErrorBox('Error', 'Error while recording ' + activityType + ' for member with Net-ID: ' + netId);
// 			}
// 		})
// }
//
//
// function findEventsByDate(startDate, endDate, callback) {
// 	connection.query('SELECT * FROM `is_events` WHERE `event_date`>=? AND `event_date`<=? ORDER BY `event_date` DESC, ' +
// 		'`event_id` DESC', [startDate, endDate], (error, results) => {
// 		if (error) {
// 			winston.error(error);
// 			dialog.showErrorBox('Error', 'Error while finding events between ' + startDate + ' and ' + endDate);
// 			return callback();
// 		}
// 		if (results) {
// 			for (let i = 0; i < results.length; i++) {
// 				results[i].event_date = moment(results[i].event_date).format("YYYY-MM-DD");
// 			}
// 		}
// 		callback(results);
// 	})
// }
const isDev = require('electron-is-dev'),
	mysql = require('mysql'),
	mysqlDB = require('./mysqlDB'),
	{ is_acl, is_activity_history, is_attendance, is_event, is_member } = new (require('./sqlTableNames'))().tableNames;

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
							if (isDev) {
								console.log('Sql statement - ', sqlStatement);
							}
							resolve(results);
						}
					);
				} else {
					connection.release();
					resolve();
				}
			});
		});
	}

	findEventsToday() {
		return this.sqlQueryHandler(
			`SELECT * FROM ${is_event} WHERE event_date=CURRENT_DATE ORDER BY event_id DESC`
		);
	}

	createEvent(eventName) {
		return this.sqlQueryHandler(
			`INSERT INTO ${is_event} (event_name,event_date) VALUES (?,CURRENT_DATE)`,
			[eventName]
		);
	}

	deleteEvent(eventId) {
		return this.sqlQueryHandler(
			`DELETE FROM ${is_event} WHERE event_id=?`,
			[eventId]
		);
	}

	retrieveEventData(eventId) {
		return this.sqlQueryHandler(
			'SELECT event_id,event_name,DATE_FORMAT(event_date,\'%b %e, %Y\') as event_date ' +
			`FROM ${is_event} WHERE event_id=?`,
			[eventId]
		);
	}

	verifyCredentials(netid) {
		return this.sqlQueryHandler(
			`SELECT * FROM ${is_acl} WHERE netid=?`,
			[netid]
		);
	}

	lookupNetid(netid) {
		return this.sqlQueryHandler(
			`SELECT * FROM ${is_member} m, ` +
			'(' +
				'SELECT timestamp as last_updated,netid ' +
				`FROM ${is_activity_history} ` +
				'WHERE netid=? AND activity_type=\'Information Updated\' ' +
				'ORDER BY timestamp DESC ' +
				'LIMIT 1' +
			') a ' +
			'WHERE m.netid=a.netid',
			[netid]
		);
	}

	retrieveMemberAttendance(netid) {
		return this.sqlQueryHandler(
			'SELECT e.event_id,event_name,DATE_FORMAT(event_date,\'%b %e, %Y\') as event_date ' +
			`FROM ${is_event} e, is_attendance a ` +
			'WHERE e.event_id=a.event_id AND netid=? ' +
			'ORDER BY e.event_id DESC',
			[netid]
		);
	}

	retrieveMemberActivity(netid) {
		return this.sqlQueryHandler(
			'SELECT activity_type,DATE_FORMAT(timestamp,\'%l:%i%p %b %e, %Y\') as activity_time ' +
			`FROM ${is_activity_history} ` +
			'WHERE netid=? ORDER BY timestamp DESC',
			[netid]
		);
	}

	recordMemberActivity(netid, activityType) {
		return this.sqlQueryHandler(
			`INSERT INTO ${is_activity_history} (netid,activity_type) VALUES (?,?)`,
			[netid, activityType]
		);
	}

	checkInMember(member, eventId) {
		return this.sqlQueryHandler(
			`INSERT INTO ${is_attendance} (netid,event_id,major,classification) VALUES (?,?,?,?)`,
			[member.netid, eventId, member.major, member.classification]
		);
	}

	createMember(member) {
		return this.sqlQueryHandler(
			`INSERT INTO ${is_member} ` +
			'(netid,first_name,last_name,major,classification,semesters_remaining,free_meeting_used) ' +
			'VALUES (?,?,?,?,?,?,?)',
			[member.netid, member.first_name, member.last_name, member.major, member.classification, member.payment, 1]
		);
	}

	updateMemberInfo(member) {
		return this.sqlQueryHandler(
			`UPDATE ${is_member} SET first_name=?,last_name=?,` +
			'major=?,classification=?,semesters_remaining=(semesters_remaining+?),free_meeting_used=? ' +
			'WHERE netid=?',
			[
				member.first_name, member.last_name, member.major, member.classification, member.payment,
				member.free_meeting_used, member.netid
			]
		);
	}

	getAttendanceForEvent(eventId) {
		return this.sqlQueryHandler(
			`SELECT m.* FROM ${is_member} m, ${is_attendance} a ` +
			'WHERE m.netid=a.netid AND event_id=? ' +
			'ORDER BY netid ASC',
			[eventId]
		);
	}

	queryEvents(dateRangeStart, dateRangeEnd, eventName = '') {
		return this.sqlQueryHandler(
			'SELECT event_id,event_name,DATE_FORMAT(event_date,\'%b %e, %Y\') as event_date ' +
			`FROM ${is_event} ` +
			'WHERE event_date>=? AND event_date<=? AND event_name LIKE ? ' +
			'ORDER BY event_id DESC',
			[dateRangeStart, dateRangeEnd, `%${eventName}%`]
		);
	}
}

module.exports = mysqlManager;
//
//
// function findEventsByDate(startDate, endDate, callback) {
// 	connection.query('SELECT * FROM `is_event` WHERE `event_date`>=? AND `event_date`<=? ORDER BY `event_date` DESC, ' +
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
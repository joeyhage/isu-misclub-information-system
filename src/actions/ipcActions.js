const ipcGeneral = {
	SET_WINDOW: 'SET_WINDOW',
	LOGIN_WINDOW: 'LOGIN_WINDOW',
	MIS_CLUB_PAGE_WINDOW: 'MIS_CLUB_PAGE_WINDOW'
};

const ipcMysql = {
	EXECUTE_SQL: 'EXECUTE_SQL',
	VERIFY_CREDENTIALS: 'VERIFY_CREDENTIALS',
	RETRIEVE_EVENTS_TODAY: 'RETRIEVE_EVENTS_TODAY',
	DELETE_EVENT: 'DELETE_EVENT',
	ADD_EVENT: 'ADD_EVENT',
	RETRIEVE_EVENT_BY_ID: 'RETRIEVE_EVENT_BY_ID',
	LOOKUP_NETID: 'LOOKUP_NETID'
};

// module.exports used because they are needed
// by main file 'electron-starter.js' which
// is not bundled with webpack
module.exports = {
	ipcGeneral,
	ipcMysql
};

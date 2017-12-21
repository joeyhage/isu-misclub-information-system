const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron'),
	{ default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer'),
	csv = require('fast-csv'),
	mysqlDump = require('mysqldump'),
	path = require('path'),
	url = require('url'),
	mysqlManager = require('./sql/mysqlManager'),
	mysql = new mysqlManager(),
	logUtil = require('./utils/logger'),
	logger = new logUtil(),
	{ verifyExecPassword } = require('./utils/activeDirectoryLookup'),
	{ requestDirectoryInfo } = require('./utils/isuDirectoryLookup'),
	{ createMenuTemplate } = require('./static/MenuTemplate'),
	{ ipcGeneral, ipcMysql } = require('./actions/ipcActions');

require('hazardous');

let mainWindow, devToolsEnabled = true;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		show: false, width: 600, height: 600, minWidth: 600, minHeight: 600, resizable: true, title: 'ISU MIS Club Check-In'
	});

	const startUrl = process.env.ELECTRON_START_URL || url.format({
		pathname: path.join(__dirname, '/../build/index.html'),
		protocol: 'file:',
		slashes: true
	});
	mainWindow.loadURL(startUrl);

	installExtension(REACT_DEVELOPER_TOOLS)
		.then((name) => logger.debug(`Added Extension:  ${name}`))
		.catch((err) => logger.error('An error occurred: ', err));

	installExtension(REDUX_DEVTOOLS)
		.then((name) => logger.debug(`Added Extension:  ${name}`))
		.catch((err) => logger.error('An error occurred: ', err));

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.webContents.on('devtools-opened', () => {
		if (!devToolsEnabled) {
			mainWindow.webContents.closeDevTools();
		}
	});
};

app.on('ready', () => {
	process.on('uncaughtException', error => {
		logger.error(error);
		app.quit();
	});
	const menu = Menu.buildFromTemplate(createMenuTemplate(app.getName(), shell));
	Menu.setApplicationMenu(menu);

	mysql.sqlQueryHandler().then(() => {
		createWindow();
		logger.debug('Connected to database successfully');
	}).catch(error => {
		logger.error(error, 'Error connecting to database. Please ensure you have an internet connection and are ' +
			'connected to the ISU Network. VPN is needed if connecting from off-campus.', true);
		app.quit();
	});

	ipcMain.on(ipcMysql.EXECUTE_SQL, async (event, action, ipcArgs) => {
		let results;
		try {
			results = await retrieveSqlData(action, ipcArgs);
		} catch (error) {
			logger.error(error, `Error retrieving SQL data for action: ${action} with arguments: ${ipcArgs}`);
		} finally {
			mainWindow.webContents.send(action, results);
		}
	});

	ipcMain.on(ipcGeneral.SET_WINDOW, (event, action) => {
		if (action === ipcGeneral.LOGIN_WINDOW) {
			mainWindow.setSize(600, 600);
		} else if (action === ipcGeneral.MIS_CLUB_PAGE_WINDOW) {
			mainWindow.setSize(1200, 800);
		}
		mainWindow.center();
	});

	ipcMain.on(ipcGeneral.REQUEST_DIRECTORY_INFO, async (event, action, ipcArgs) => {
		const {netid} = ipcArgs;
		let member;
		try {
			member = await requestDirectoryInfo(netid);
		} catch (error) {
			logger.error(error, `Error getting directory info for Net-ID: ${netid}`, true);
		} finally {
			if (!member || !(member.first_name && member.last_name && member.classification && member.major)) {
				logger.error(null, `Incomplete data - ${member} - for member with Net-ID: ${netid}`);
			}
			mainWindow.webContents.send(ipcGeneral.REQUEST_DIRECTORY_INFO, member);
		}
	});
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const retrieveSqlData = (action, ipcArgs) => {
	return sqlActions[action] ? sqlActions[action](ipcArgs) : ipcArgs['default'](action);
};

const sqlActions = {
	[ipcMysql.RETRIEVE_EVENTS_TODAY]: async () => {
		try {
			return await mysql.retrieveEventsToday();
		} catch (error) {
			logger.error(error, 'Error while retrieving events for today', true);
		}
	},
	[ipcMysql.ADD_EVENT]: async ipcArgs => {
		try {
			const results = await mysql.addEvent(ipcArgs.eventName);
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
				devToolsEnabled = Boolean(admin);
				return {
					userId: netid,
					accessLevel: admin ? 'exec-admin' : 'exec'
				};
			}
		}
	},
	[ipcMysql.LOOKUP_NETID]: async ipcArgs => {
		const {netid} = ipcArgs;
		try {
			return await Promise.all(
				[
					mysql.retrieveMemberInfo(netid),
					mysql.retrieveMemberAttendance(netid),
					mysql.retrieveMemberActivity(netid)
				]
			);
		} catch (error) {
			logger.error(error, `Error looking up member with netid: ${netid}`, true);
		}
	},
	[ipcMysql.RETRIEVE_ATTENDANCE]: async ipcArgs => {
		const {eventId} = ipcArgs;
		try {
			return await mysql.retrieveAttendanceForEvent(eventId);
		} catch (error) {
			logger.error(error, `Error while getting event attendance info for event: ${eventId}`, true);
		}
	},
	[ipcMysql.FIND_EVENTS]: async ipcArgs => {
		const {dateRangeStart, dateRangeEnd, eventName} = ipcArgs;
		try {
			return await mysql.findEvents(dateRangeStart, dateRangeEnd, eventName);
		} catch (error) {
			logger.error(error, `'Error while finding events between ${dateRangeStart} and ${dateRangeEnd} with event name ${eventName}`, true);
		}
	},
	'default': action => {
		logger.error(null, `Invalid SQL action: ${action}`);
	}
};
const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron'),
	{ default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer'),
	csv = require('fast-csv'),
	moment = require('moment'),
	mysqlDump = require('mysqldump'),
	path = require('path'),
	url = require('url'),
	winston = require('winston'),
	{ mysqlManager } = require('./utils/mysqlManager'),
	{ verifyExecPassword } = require('./utils/activeDirectoryLookup'),
	{ requestDirectoryInfo } = require('./utils/isuDirectoryLookup'),
	{ createMenuTemplate } = require('./static/MenuTemplate'),
	{ ipcGeneral, ipcMysql } = require('./actions/ipcActions');

require('hazardous');
require('winston-daily-rotate-file');

const today = moment().format('YYYY-MM-DD');
let mainWindow, mysql, logger, devToolsEnabled = true;

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
	const dailyRotateTransport = new (winston.transports.DailyRotateFile)({
		filename: './log',
		localTime: true,
		maxFiles: 20,
		prepend: true
	});
	logger = new (winston.Logger)({
		transports: [dailyRotateTransport]
	});
	process.on('uncaughtException', error => {
		logger.error(error);
		app.quit();
	});
	const menu = Menu.buildFromTemplate(createMenuTemplate(app.getName(), shell));
	Menu.setApplicationMenu(menu);

	mysql = new mysqlManager(today);

	mysql.connect().then(() => {
		createWindow();
		logger.debug('Connected to database successfully');
	}).catch(error => {
		logErrorAndSendMessage(error, 'Error connecting to database. Please ensure you have an internet connection and are ' +
			'connected to the ISU Network. VPN is needed if connecting from off-campus.');
		app.quit();
	});

	ipcMain.on(ipcMysql.EXECUTE_SQL, async (event, action, ipcArgs) => {
		let results;
		try {
			results = await retrieveSqlData(action, ipcArgs);
		} catch (error) {
			logErrorAndSendMessage(error, `Error retrieving SQL data for action: ${action} with arguments: ${ipcArgs}`, true);
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
			logErrorAndSendMessage(error, `Error getting directory info for Net-ID: ${netid}`);
		} finally {
			if (!member || !(member.first_name && member.last_name && member.classification && member.major)) {
				logErrorAndSendMessage(null, `Incomplete data - ${member} - for member with Net-ID: ${netid}`, true);
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

const logErrorAndSendMessage = (error, message, logOnly) => {
	if (error) {
		logger.error(error);
	}
	if (message) {
		logger.error(new Error(message));
		if (!logOnly) {
			dialog.showErrorBox('Error', message);
		}
	}
};

const retrieveSqlData = (action, ipcArgs) => {
	return ipcActions[action] ? ipcActions[action](ipcArgs) : ipcArgs['default'](action);
};

const ipcActions = {
	[ipcMysql.RETRIEVE_EVENTS_TODAY]: async () => {
		try {
			return await mysql.retrieveEventsToday();
		} catch (error) {
			logErrorAndSendMessage(error, 'Error while retrieving events for today');
		}
	},
	[ipcMysql.ADD_EVENT]: async ipcArgs => {
		try {
			const results = await mysql.addEvent(ipcArgs.eventName);
			return results.insertId;
		} catch (error) {
			logErrorAndSendMessage(error, `Error while adding event: ${ipcArgs.eventName}`);
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
			logErrorAndSendMessage(error, `Error while deleting event with ID: ${ipcArgs.eventId}`);
		}
	},
	[ipcMysql.RETRIEVE_EVENT_BY_ID]: async ipcArgs => {
		const {eventId} = ipcArgs;
		let results;
		try {
			results = await mysql.retrieveEventData(eventId);
		} catch (error) {
			logErrorAndSendMessage(error, `Error while retrieving event data for event ID: ${eventId}`);
		}
		if (results && results.length) {
			const result = results[0];
			if (result.event_date) {
				result.event_date = moment(result.event_date).format('YYYY-MM-DD');
				return result;
			} else {
				logErrorAndSendMessage(null, `Result did not have event date for event ID: ${eventId}`, true);
			}
		} else {
			logErrorAndSendMessage(null, `Unable to find event ID: ${eventId}`);
		}
	},
	[ipcMysql.VERIFY_CREDENTIALS]: async ipcArgs => {
		const {netid} = ipcArgs;
		let results;
		try {
			results = await mysql.verifyCredentials(netid);
		} catch (error) {
			logErrorAndSendMessage(error, `Error verifying credentials for user: ${netid}`);
		}
		if (results && results.length) {
			let auth;
			try {
				auth = await verifyExecPassword(netid, ipcArgs.password);
			} catch (error) {
				logErrorAndSendMessage(error, `Error verifying password for user: ${netid}`);
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
			const results = await mysql.retrieveMemberInfo(netid);
			return results && results.length ? results[0] : null;
		} catch (error) {
			logErrorAndSendMessage(error, `Error looking up member with netid: ${netid}`);
		}
	},
	'default': action => {
		logErrorAndSendMessage(null, `Invalid SQL action: ${action}`, true);
	}
};
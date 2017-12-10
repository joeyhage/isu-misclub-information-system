const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron'),
	{ default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer'),
	csv = require('fast-csv'),
	moment = require('moment'),
	mysqlDump = require('mysqldump'),
	path = require('path'),
	request = require('request'),
	url = require('url'),
	winston = require('winston'),
	{ mysqlManager } = require('./utils/mysqlManager'),
	{ verifyExecPassword } = require('./utils/activeDirectoryLookup'),
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
		transports: [
			dailyRotateTransport
		]
	});
	process.on('uncaughtException', (error) => {
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
		const errorMessage = 'Error connecting to database. Please ensure you have an internet connection and are ' +
			'connected to the ISU Network. VPN is needed if connecting from off-campus.\n';
		logger.error(errorMessage + error);
		dialog.showErrorBox('Connection Failed', errorMessage);
		app.quit();
	});

	ipcMain.on(ipcMysql.EXECUTE_SQL, async (event, action, ipcArgs) => {
		const results = await retrieveSqlData(action, ipcArgs);
		mainWindow.webContents.send(action, results);
	});

	ipcMain.on(ipcGeneral.SET_WINDOW, (event, action) => {
		if (action === ipcGeneral.LOGIN_WINDOW) {
			mainWindow.setSize(600, 600);
		} else if (action === ipcGeneral.MIS_CLUB_PAGE_WINDOW) {
			mainWindow.setSize(1200, 800);
		}
		mainWindow.center();
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
	return ipcActions[action] ? ipcActions[action](ipcArgs) : ipcArgs['default'](action);
};

const ipcActions = {
	[ipcMysql.RETRIEVE_EVENTS_TODAY]: async () => {
		try {
			return await mysql.retrieveEventsToday();
		} catch (error) {
			logger.error(error);
			dialog.showErrorBox('Error', 'Error while retrieving events for today');
		}
	},
	[ipcMysql.ADD_EVENT]: async ipcArgs => {
		try {
			const results = await mysql.addEvent(ipcArgs.eventName);
			return results.insertId;
		} catch (error) {
			logger.error(error);
			dialog.showErrorBox('Error', `Error while adding event: ${ipcArgs.eventName}`);
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
			logger.error(error);
			dialog.showErrorBox('Error', `Error while deleting event with ID: ${ipcArgs.eventId}`);
		}
	},
	[ipcMysql.RETRIEVE_EVENT_BY_ID]: async ipcArgs => {
		const {eventId} = ipcArgs;
		let results;
		try {
			results = await mysql.retrieveEventData(eventId);
		} catch (error) {
			logger.error(error);
			const errorMessage = `Error while retrieving event data for event ID: ${eventId}`;
			logger.error(new Error(errorMessage));
			dialog.showErrorBox('Error', errorMessage);
		}
		if (results && results.length) {
			const result = results[0];
			if (result.event_date) {
				result.event_date = moment(result.event_date).format('YYYY-MM-DD');
				return result;
			} else {
				const errorMessage = `Result did not have event date for event ID: ${eventId}`;
				logger.error(new Error(errorMessage));
				dialog.showErrorBox('Error', errorMessage);
			}
		} else {
			const errorMessage = `Unable to find event ID: ${eventId}`;
			logger.error(new Error(errorMessage));
			dialog.showErrorBox('Error', errorMessage);
		}
	},
	[ipcMysql.VERIFY_CREDENTIALS]: async ipcArgs => {
		const {netid} = ipcArgs;
		let results;
		try {
			results = await mysql.verifyCredentials(netid);
		} catch (error) {
			logger.error(error);
			const errorMessage = `Error verifying credentials for user: ${netid}`;
			logger.error(new Error(errorMessage));
			dialog.showErrorBox('Error', errorMessage);
		}
		if (results && results.length) {
			let auth;
			try {
				auth = await verifyExecPassword(netid, ipcArgs.password);
			} catch (error) {
				logger.error(error);
				logger.error(new Error('Error validating admin'));
				dialog.showErrorBox('Error', `Error verifying credentials for user: ${netid}`);
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
			logger.error(error);
			const errorMessage = `Error looking up member with netid: ${netid}`;
			logger.error(new Error(errorMessage));
			dialog.showErrorBox('Error', errorMessage);
		}
	},
	'default': action => {
		const errorMessage = `Invalid SQL action: ${action}`;
		logger.error(new Error(errorMessage));
		dialog.showErrorBox('Error', errorMessage);
	}
};
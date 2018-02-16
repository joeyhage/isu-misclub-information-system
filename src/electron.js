const electron = require('electron'),
	{ app, BrowserWindow, Menu, ipcMain, dialog } = electron,
	isDev = require('electron-is-dev'),
	path = require('path'),
	url = require('url'),
	logger = new (require('./utils/logger'))(),
	mysql = new (require('./sql/mysqlManager'))(logger),
	sqlActions = require('./actions/sqlActions')(mysql, logger),
	{ requestDirectoryInfo } = require('./utils/isuDirectoryLookup'),
	{ writeCsv } = require('./utils/csvUtil'),
	{ createMenuTemplate } = require('./static/menuTemplate'),
	{ ipcGeneral, ipcMysql } = require('./actions/ipcActions');

let mainWindow, devToolsEnabled = isDev;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		show: false,
		width: 600,
		height: 600,
		minWidth: 600,
		minHeight: 600,
		resizable: true,
		title: 'ISU MIS Club Information System'
	});

	const startUrl = isDev ? 'http://localhost:3000' : url.format({
		pathname: path.join(__dirname, '../build/index.html'),
		protocol: 'file:',
		slashes: true
	});
	mainWindow.loadURL(startUrl);

	if (isDev) {
		const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => logger.debug(`Added Extension: ${name}`))
			.catch((error) => logger.error('An error occurred: ', error));

		installExtension(REDUX_DEVTOOLS)
			.then((name) => logger.debug(`Added Extension: ${name}`))
			.catch((error) => logger.error('An error occurred: ', error));
	}

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.center();
		mainWindow.focus();
	});

	mainWindow.webContents.on('devtools-opened', () => {
		if (!devToolsEnabled) {
			mainWindow.webContents.closeDevTools();
		}
	});
};

app.on('ready', () => {
	const onFailedPoolConnection = error => {
		logger.error(error, 'Error connecting to database. Please ensure you have an internet connection and are ' +
			'connected to the ISU Network. VPN is needed if connecting from off-campus.', true);
		app.quit();
	};
	process.on('uncaughtException', error => {
		if (error.code === 'ECONNRESET') {
			mysql.endPool().then(() => {
				mysql.createPool();
				mysql.testPoolConnection().catch(onFailedPoolConnection);
			});
		} else {
			logger.error('Uncaught exception. App will quit.');
			logger.error(error);
			app.quit();
		}
	});
	process.on('warning', error => logger.error(`Warning: ${error}`));
	const menu = Menu.buildFromTemplate(createMenuTemplate(logger));
	Menu.setApplicationMenu(menu);

	mysql.testPoolConnection().then(() => {
		createWindow();
		logger.debug('Connected to database successfully');
	}).catch(onFailedPoolConnection);

	ipcMain.on(ipcMysql.EXECUTE_SQL, async (event, action, ipcArgs) => {
		let results, status;
		try {
			results = await retrieveSqlData(action, ipcArgs);
			status = ipcGeneral.SUCCESS;
		} catch (error) {
			logger.error(error, `Error performing SQL action: ${action} with arguments: ${ipcArgs}`);
			status = ipcGeneral.ERROR;
		}
		if (action === ipcMysql.VERIFY_CREDENTIALS && results && results.hasOwnProperty('devToolsEnabled')) {
			devToolsEnabled = results.devToolsEnabled;
			delete results.devToolsEnabled;
		}
		mainWindow.webContents.send(action, results, status);
	});

	ipcMain.on(ipcGeneral.SET_WINDOW, (event, action) => {
		const [windowWidth, windowHeight] = mainWindow.getSize();
		const {width: screenWidth, height: screenHeight} = electron.screen.getPrimaryDisplay().workAreaSize;
		if (action === ipcGeneral.LOGIN_WINDOW) {
			if (windowWidth === 600 && windowHeight === 600) {
				return;
			}
			mainWindow.hide();
			mainWindow.setSize(600, 600);
		} else if (action === ipcGeneral.MIS_CLUB_PAGE_WINDOW) {
			if (windowWidth === screenWidth && windowHeight === screenHeight) {
				return;
			}
			mainWindow.hide();
			mainWindow.setSize(screenWidth, screenHeight);
		}
		setTimeout(() => {
			mainWindow.show();
			mainWindow.center();
			mainWindow.focus();
		}, 1000);
	});

	ipcMain.on(ipcGeneral.REQUEST_DIRECTORY_INFO, async (event, action, ipcArgs) => {
		const {netid} = ipcArgs;
		let member;
		try {
			member = await requestDirectoryInfo(netid);
		} catch (error) {
			logger.error(error, `Error getting directory info for Net-ID: ${netid}`, true);
		}
		if (!member || !(member.first_name && member.last_name && member.classification && member.major)) {
			logger.debug(null, `Incomplete data - ${JSON.stringify(member)} - for member with Net-ID: ${netid}`);
		}
		mainWindow.webContents.send(ipcGeneral.REQUEST_DIRECTORY_INFO, member);
	});

	ipcMain.on(ipcGeneral.WRITE_ATTENDANCE_TO_CSV, async (event, action, ipcArgs) => {
		const {attendance, eventName, eventDate} = ipcArgs;
		try {
			await dialog.showSaveDialog(
				mainWindow,
				{ defaultPath: path.join(app.getPath('documents'), `${eventName}_${eventDate}.csv`) },
				async filename => {
					if (filename) {
						await writeCsv(filename, attendance);
					}
				}
			);
		} catch (error) {
			logger.error(error, 'Failed to export data to csv.', true);
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

app.on('will-quit', () => {
	mysql.endPool();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const retrieveSqlData = (action, ipcArgs) => {
	return sqlActions[action] ? sqlActions[action](ipcArgs) : sqlActions['default'](action);
};
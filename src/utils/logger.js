const { dialog } = require('electron'),
	dateFormat = require('dateformat'),
	fs = require('fs'),
	isDev = require('electron-is-dev'),
	homedir = require('os').homedir(),
	path = require('path'),
	winston = require('winston');

require('winston-daily-rotate-file');

class logUtil {
	constructor() {
		const appName = 'ISU MIS Club Information System';
		const filePath = path.join(
			homedir,
			process.platform === 'darwin' ? '/Library/Logs/' : '\\AppData\\Roaming\\',
			appName
		);

		try {
			fs.accessSync(filePath, fs.constants.W_OK);
		} catch (err) {
			fs.mkdirSync(filePath);
		}

		if (isDev) {
			const consoleTransport = new (winston.transports.Console)({
				timestamp: () => dateFormat(),
				level: 'debug'
			});
			this.log = new (winston.Logger)({
				transports: [consoleTransport]
			});
		} else {
			const dailyRotateTransport = new (winston.transports.DailyRotateFile)({
				timestamp: () => dateFormat(),
				filename: path.join(filePath, 'log'),
				localTime: true,
				maxFiles: 20,
				prepend: true,
				level: 'warn'
			});
			this.log = new (winston.Logger)({
				transports: [dailyRotateTransport]
			});
		}
	}

	error(error, message, displayDialog = false) {
		if (error) {
			this.log.error(error);
		}
		if (message) {
			this.log.error(new Error(message));
			if (displayDialog) {
				dialog.showErrorBox('Error', message);
			}
		}
	}

	info(message) {
		this.log.info(message);
	}

	debug(message) {
		this.log.debug(message);
	}
}

module.exports = logUtil;
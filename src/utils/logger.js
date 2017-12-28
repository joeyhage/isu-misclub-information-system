const { dialog } = require('electron'),
	moment = require('moment'),
	winston = require('winston');

require('winston-daily-rotate-file');

class logUtil {
	constructor() {
		const dailyRotateTransport = new (winston.transports.DailyRotateFile)({
			timestamp: () => moment().format(),
			filename: './log',
			localTime: true,
			maxFiles: 20,
			prepend: true
		});
		this.log = new (winston.Logger)({
			transports: [dailyRotateTransport]
		});
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
	};

	info(message) {
		this.log.info(message);
	}

	debug(message) {
		this.log.debug(message);
	}
}

module.exports = logUtil;
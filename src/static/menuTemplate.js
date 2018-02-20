const { app, BrowserWindow, shell, dialog } = require('electron'),
	fs = require('fs'),
	path = require('path'),
	isDev = require('electron-is-dev');

const createMenuTemplate = logger => {
	const template = [
		{
			label: 'Edit',
			submenu: [
				{role: 'undo'},
				{role: 'redo'},
				{type: 'separator'},
				{role: 'cut'},
				{role: 'copy'},
				{role: 'paste'},
				{role: 'pasteandmatchstyle'},
				{role: 'delete'},
				{role: 'selectall'}
			]
		},
		{
			label: 'View',
			submenu: isDev ? [
				{role: 'reload'},
				{role: 'toggledevtools'},
				{type: 'separator'},
				{role: 'resetzoom'},
				{role: 'zoomin'},
				{role: 'zoomout'},
				{type: 'separator'},
				{role: 'togglefullscreen'}
			] : [
				{role: 'reload'},
				{type: 'separator'},
				{role: 'resetzoom'},
				{role: 'zoomin'},
				{role: 'zoomout'},
				{type: 'separator'},
				{role: 'togglefullscreen'}
			]
		},
		{
			role: 'window',
			submenu: process.platform === 'darwin' ? [
				{label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close'},
				{label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize'},
				{label: 'Zoom', role: 'zoom'},
				{type: 'separator'},
				{label: 'Bring All to Front', role: 'front'}
			] : [
				{role: 'minimize'},
				{role: 'close'}
			]
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'ISU MIS Club Website',
					click () { shell.openExternal('http://www.mis.stuorg.iastate.edu'); }
				}
			]
		}
	];

	if (process.platform === 'darwin') {
		template.unshift({
			label: 'ISU MIS Club Information System',
			submenu: [
				{label: 'About ISU MIS Club Information System', role: 'about'},
				{type: 'separator'},
				{label: 'Hide ISU MIS Club Information System', role: 'hide'},
				{role: 'hideothers'},
				{role: 'unhide'},
				{type: 'separator'},
				{label: 'Quit ISU MIS Club Information System', role: 'quit'},
			]
		}, {
			label: 'File',
			submenu: [savePageAs(logger)]
		});
	} else {
		template.unshift({
			label: 'File',
			submenu: [
				{label: 'About ISU MIS Club Information System', role: 'about'},
				{type: 'separator'},
				savePageAs(logger),
				{label: 'Quit ISU MIS Club Information System', role: 'quit'},
			]
		});
	}
	return template;
};

const savePageAs = logger => ({
	label: 'Save Page As PDF',
	accelerator: 'CmdOrCtrl+S',
	click () {
		const mainWindow = BrowserWindow.getFocusedWindow();
		if (mainWindow) {
			dialog.showSaveDialog(
				mainWindow,
				{ defaultPath: path.join(app.getPath('documents'), 'Untitled.pdf') },
				filename => {
					if (filename) {
						mainWindow.webContents.printToPDF({ landscape: true }, (error, data) => {
							if (error) {
								logger.error(error, 'Error creating PDF', true);
							}
							fs.writeFile(filename, data, error => {
								if (error) {
									logger.error(error, 'Error saving PDF', true);
								}
								logger.debug('Saved PDF successfully.');
							});
						});
					}
				}
			);
		}
	}
});

module.exports = { createMenuTemplate };
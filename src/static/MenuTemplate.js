exports.createMenuTemplate = (appName, shell) => {
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
			submenu: [
				{role: 'reload'},
				{role: 'toggledevtools'},
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
			submenu: [
				{role: 'minimize'},
				{role: 'close'}
			]
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'ISU MIS Club Website',
					click () { shell.openExternal('http://www.mis.stuorg.iastate.edu') }
				}
			]
		}
	];

	if (process.platform === 'darwin') {
		template.unshift({
			label: appName,
			submenu: [
				{role: 'about'},
				{type: 'separator'},
				{role: 'hide'},
				{role: 'hideothers'},
				{role: 'unhide'},
				{type: 'separator'},
				{role: 'quit'}
			]
		});
		// Window menu.
		template[3].submenu = [
			{label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close'},
			{label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize'},
			{label: 'Zoom', role: 'zoom'},
			{type: 'separator'},
			{label: 'Bring All to Front', role: 'front'}
		];
	} else {
		template.unshift({
			label: 'File',
			submenu: [
				{role: 'about'},
				{type: 'separator'},
				{role: 'quit'}
			]
		});
	}
	return template;
};
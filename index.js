var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var db = require('./src/lib/db');

var mainWindow = null
	,	createWindow = null
	,	editWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 500, height: 400, resizable: false });
  mainWindow.on('closed', function() {
    editWindow = null;
    createWindow = null;
    mainWindow = null;
  });

  ipc.on('edit-item', function(idk, itemId) {
  	function closeWin() {
			editWindow = null;
  	}
  	function createEditWin() {
		  editWindow = new BrowserWindow({ width: 355, height: 625, resizable: false });
		  editWindow.loadUrl('file://' + __dirname + '/edit.html?id=' + itemId);
			editWindow.on('close', closeWin);
		}

		if (editWindow) { 
			editWindow.close();
			closeWin();
		}
		createEditWin();
  });

  ipc.on('create-item', function(idk) {
  	function closeWin() {
  		createWindow = null;
  	}

  	function createCreateWin() {
  		createWindow = new BrowserWindow({ width: 325, height: 500, resizable: false });
  		createWindow.loadUrl('file://' + __dirname + '/createItem.html');
  		createWindow.on('close', closeWin);
  	}

		if (createWindow) { 
			createWindow.close();
			closeWin();
		}
  	createCreateWin();
  });

  ipc.on('close-edit-win', function() {
  	editWindow.close();
  	editWindow = null;
  });

  ipc.on('close-create-win', function() {
  	createWindow.close();
  	createWindow = null;
  });

  var firsttime = false;
  // TODO check if first time
  var loadFile = '/first_html.html';
  if (!firsttime) loadFile = '/index.html'; 
  mainWindow.loadUrl('file://' + __dirname + loadFile);

  if (process.env.NODE_ENV === 'development') mainWindow.openDevTools();
});
var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var db = require('./src/lib/db');

var mainWindow = null
	,	createWindow = null
	,	editWindow = null
	,	exportWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 350, height: 400 });
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
		  editWindow = new BrowserWindow({ width: 375, height: 700, resizable: false });
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

  ipc.on('export-win', function(idk) {
  	function closeWin() {
  		exportWindow = null;
  	}

  	function createExportWin() {
  		exportWindow = new BrowserWindow({ width: 325, height: 500 });
  		exportWindow.loadUrl('file://' + __dirname + '/export.html');
  		exportWindow.on('close', closeWin);
  	}

		if (exportWindow) { 
			exportWindow.close();
			closeWin();
		}
  	createExportWin();
  });

  ipc.on('close-edit-win', function() {
  	editWindow.close();
  	editWindow = null;
  });

  ipc.on('close-create-win', function() {
  	createWindow.close();
  	createWindow = null;
  });

  ipc.on('close-export-win', function() {
  	exportWindow.close();
  	exportWindow = null;
  });

  // tell main to request / update it's data
  ipc.on('refresh', function() {
  	mainWindow.webContents.send('refresh');
  });

  /* 
  	database event hooks
  	a payload looks like this...
  	{
  		dbName: <the table to access>
  		all: bool to know which operation to run on the table
  		dbOptions: <sequelize options to be passed ({where: {id ... }})>
			targetWindow: <a string of the variable name to send the requested data back to>
			targetEvent: <a event string used by receiver to handle this request>
  	}
  */
  ipc.on('data-request', function(event, payload) {
  	var targetWindow = mainWindow;
  	switch(payload.targetWindow.toLowerCase()) {
  		case 'createwindow':
  			targetWindow = createWindow;
  			break;
  		case 'editwindow':
  			targetWindow = editWindow;
  			break;
   		case 'exportwindow':
  			targetWindow = exportWindow;
  			break;
  		case 'mainwindow':
  			targetWindow = mainWindow;
  			break;
  	}

  	function successHandler(result) {
  		targetWindow.webContents.send(payload.targetEvent, null, result);
  	}

  	function errHandler(err) {
  		targetWindow.webContents.send(payload.targetEvent,err, null);
  	}

  	if (payload.dbOptions && payload.all) {
  		// if there's options and all, we want to findAll
	  	payload.dbOptions.raw = true;
  		db[payload.dbName].findAll(payload.dbOptions)
  				.then(successHandler).catch(errHandler);
  	} else if (payload.dbOptions && !payload.all) {
  		// single record to look up
	  	payload.dbOptions.raw = true;
   		db[payload.dbName].findOne(payload.dbOptions)
  				.then(successHandler).catch(errHandler);
  	} else {
   		db[payload.dbName].all({raw: true})
  				.then(successHandler).catch(errHandler);
  	}
  });

  /*
  	dbName, create (bool), all (bool), dbOptions, data, targetWindow, targetEvent
   */
  ipc.on('data-write', function(event, payload) {
  	var targetWindow = mainWindow;
  	switch(payload.targetWindow.toLowerCase()) {
  		case 'createwindow':
  			targetWindow = createWindow;
  			break;
  		case 'editwindow':
  			targetWindow = editWindow;
  			break;
  		case 'mainwindow':
  			targetWindow = mainWindow;
  	}

  	function successHandler(result) {
  		targetWindow.webContents.send(payload.targetEvent, null, result);
  	}

  	function errHandler(err) {
  		targetWindow.webContents.send(payload.targetEvent,err.toString(), null);
  	}


  	if (payload.create) {
  		db[payload.dbName].create(payload.data).then(successHandler).catch(errHandler);
  	} else {
  		if (payload.all) {
	  		db[payload.dbName].findAll(payload.dbOptions)
	  				.then(function(result) {
	  					if (!result.length) {
	  						errHandler('Nothing to sell.');
	  						return;
	  					}
	  					result[0].updateAttributes(payload.data).then(successHandler).catch(errHandler);
	  				}).catch(errHandler);
  		} else {
	  		db[payload.dbName].findOne(payload.dbOptions)
	  			.then(function(result) {
	  				result.updateAttributes(payload.data).then(successHandler).catch(errHandler);
	  			}).catch(errHandler);
  		}
  	}
  });

  //////////////////////////

  var firsttime = false;
  // TODO check if first time
  var loadFile = '/first_html.html';
  if (!firsttime) loadFile = '/index.html'; 
  mainWindow.loadUrl('file://' + __dirname + loadFile);

  if (process.env.NODE_ENV === 'development') mainWindow.openDevTools();
});
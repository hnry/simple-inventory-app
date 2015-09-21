var fs = require('fs');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var path = require('path');

function transform(inputPath, outputPath) {
	function writeFile(bundle) {
		bundle.bundle().on('error', function(err) {
			console.log(err.toString());
		});
		
		var writeStream = fs.createWriteStream(outputPath);
		bundle.bundle().pipe(writeStream);
	}

	var bundle = watchify(browserify(inputPath, { verbose: true, debug: true })).transform(babelify);
	
	writeFile(bundle);

	bundle.on('update', function(filepath) {
		console.log('updating...', filepath)
		writeFile(bundle);
	});

	bundle.on('log', console.error);
}

transform(__dirname + '/src/app.js', __dirname + '/build/app.js');
transform(__dirname + '/src/edit.js', __dirname + '/build/edit.js');
transform(__dirname + '/src/create.js', __dirname + '/build/create.js');

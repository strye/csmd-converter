#!/usr/bin/env node
var convFactory = require("./converter-factory");
//var getMeta - require("./converter").GetMdMeta


exports = module.exports = function(file, options) {
	var convertLine = require("./line-conv");
	//convertLine.reset();

	// The format to convert to
	let type = options.type || "pdf";

	// The file name and path to output to
	let outputFile = options.outputFile || "script.pdf";

	// The special purpose of the file. 
	//    s=script (default)
	//    a=artist
	//    l=letterer
	//    f=full (With personal comments)
	let mode = options.mode || "s";

	// The file creator. Name used for file metadata.
	let creator = options.creator || "Anonymous";


	//console.log('convertion type: %s output path: %s file: %s', program.convertiontype, program.outputpath, file);
	
	var conv = new convFactory({type: type, outputFile: outputFile, creator: creator});
	conv.converter.Setup();


	// read file line by line
	var lineReader = require('readline').createInterface({
		input: require('fs').createReadStream(file)
	});

	lineReader.on('line', function (line) {
		convertLine(line.trim(), conv, mode);
	});

	lineReader.on('close', function () {
		conv.converter.Cleanup();
	});

}


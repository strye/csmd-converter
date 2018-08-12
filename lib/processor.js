#!/usr/bin/env node
let readLines = require('./read-file'),
	fileProcessor = require('./file-proc');

exports = module.exports = function(file, options) {
	let outputOptions = {}

	// The format to convert to
	outputOptions.type = options.type || "pdf";

	// The file name and path to output to
	outputOptions.outputFile = options.outputFile || "script." + options.type

	// The special purpose of the file. 
	//    s=script (default)
	//    a=artist
	//    l=letterer
	//    f=full (With personal comments)
	//    r=reset (Resets the base parameters)
	outputOptions.mode = options.mode || "s";

	// The file creator. Name used for file metadata.
	outputOptions.creator = options.creator || "Anonymous";


	// Read file
	readLines(file)
	.then(function(script) {	
		fileProcessor(script, options)
		.then(function(opts){
			console.log(opts)
		})
	})

}

#!/usr/bin/env node
let fileReader = require('./file-reader'),
	fileProcessor = require('./json-processor');

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
	reader = new fileReader();
	return reader.read(file)
	.then(function(script) {
		let jsonProc =  new fileProcessor(options)	
		return jsonProc.process(script)
	})
}

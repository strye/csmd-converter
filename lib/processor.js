#!/usr/bin/env node
var convFactory = require("./converter-factory");
var convertLine = require("./line-conv");
//var getMeta - require("./converter").GetMdMeta

var parseVars = {
	commentOn: false,
	dialogOn: false,
	pageNum: 0,
	panelNum: 0,
	dialogNum: 0
}
var outputStream;
var previousLine = "";

var jsonRep = {
	metaData: {},
	pages: [],
	characters: [],
	text: []
};


// comicmd script.md -t comxpd -o issue1.docx
// comicmd script.md -t comxpd -o issue1.docx -c 'Will Strye' -m s
// comicmd script.md -t docxt -o issue1.docx

// comicmd <file> -t pdf -o issue1.pdf
// comicmd script.md -t pdf -o issue1.pdf
// comicmd script.md -t comxp -o issue1.pdf
// comicmd paper.md -t wpdf -o paper.pdf -c 'Will Strye' -m s


exports = module.exports = function(file, options) {
	var self = this;

	// The file to convert
	self.file = file; 

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


// program
// 	.arguments('<file>')
// 	.option('-t, --convertiontype <convertiontype>', 'The format to convert to', 'cli')
// 	.option('-o, --outputpath <outputpath>', 'The file name and path to output to', './output.txt')
// 	.option('-m, --mode <mode>', 'The special purpose of the file. f=full a=artist l=letterer s=script', 's')
// 	.option('-c, --creator <creator>', 'The file creator. Name used for file metadata.', 'Clippy')
// 	.action(function(file) {
// 		//console.log('convertion type: %s output path: %s file: %s', program.convertiontype, program.outputpath, file);
		
// 		var conv = new convFactory({type: program.convertiontype, outputFile: program.outputpath, creator: program.creator});
// 		conv.converter.Setup();


// 		// read file line by line
// 		var lineReader = require('readline').createInterface({
// 			input: require('fs').createReadStream(file)
// 		});

// 		lineReader.on('line', function (line) {
// 			convertLine(line.trim(), conv, program.mode);
// 		});

// 		lineReader.on('close', function () {
// 			conv.converter.Cleanup();
// 		});

// 	})
// 	.parse(process.argv);


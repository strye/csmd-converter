#!/usr/bin/env node
var program = require('commander');
var chalk = require('chalk');
var convFactory = require("./converter").ConverterFactory;
var convertLine = require("./converter").LineConverter;
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
// comicmd script.md -t docxt -o issue1.docx

// comicmd <file> -t pdf -o issue1.pdf
// comicmd script.md -t pdf -o issue1.pdf
// comicmd script.md -t comxp -o issue1.pdf
// comicmd paper.md -t wpdf -o paper.pdf

program
	.arguments('<file>')
	.option('-t, --convertiontype <convertiontype>', 'The format to convert to', 'cli')
	.option('-o, --outputpath <outputpath>', 'The file name and path to output to', './output.txt')
	.action(function(file) {
		//console.log('convertion type: %s output path: %s file: %s', program.convertiontype, program.outputpath, file);
		
		var conv = new convFactory({type: program.convertiontype, outputFile: program.outputpath});
		conv.converter.Setup();


		// read file line by line
		var lineReader = require('readline').createInterface({
			input: require('fs').createReadStream(file)
		});

		lineReader.on('line', function (line) {
			convertLine(line.trim(), conv);
		});

		lineReader.on('close', function () {
			conv.converter.Cleanup();
		});

	})
	.parse(process.argv);


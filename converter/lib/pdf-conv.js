var fs  = require("fs");
//var chalk = require('chalk');
var PDFDocument = require('pdfkit');
var doc;

exports = module.exports = function Converter(options)
{
	var self = this;

	var doc = new PDFDocument();

	var marginLeft = 72;
	var fontSize = 12;
	var parGap = 8;
	//468

	var outputFile = options.outputFile || "./output.pdf"


	var writeLine = function(line, options){
		var opts = {lineGap:4};
		if (options) { 
			opts = options;
			opts.lineGap = 4;
		}

		doc.text(line, opts);
	}

	self.Setup = function() {  
		// Delete file if it exists
		try {
			fs.unlinkSync(outputFile)
		} catch (e) {
			if (!e.errno === -2) console.log(e)
		}

		// Setup file
		//fs.createReadStream('./converter/htmlheader.txt').pipe(fs.createWriteStream(outputFile));
		doc = new PDFDocument();
		doc.pipe(fs.createWriteStream(outputFile));

		// Set Fonts
		//doc.font('Courier', fontSize);
		doc.font('Times-Roman', fontSize);


	}
	self.Cleanup = function() {
		doc.end();
	}


	self.Comment = function(line) {
		writeLine(line, 'comment');
	}


	// Page Marker
	self.PageHeading = function(line, number) {
		doc.addPage();

		//writeLine("PAGE " + number, 'pageHeading');
		doc.fontSize(14)
			.font('Times-Bold')
			.text("PAGE " + number, {underline: true, lineGap:6})
			.fontSize(fontSize)
			.font('Times-Roman');

		if (line.length > 0) writeLine(line.toUpperCase());
	}



	// Panel Marker
	self.PanelHeading = function(line, number) { 
		//writeLine("PANEL " + number, 'panelHeading'); 
		doc.font('Times-Bold')
			.text("PANEL " + number, {lineGap:6})
			.font('Times-Roman');

		if (line.length > 0) writeLine(line.toUpperCase());
	}



	// Title Page
	self.Title = function(line) { 
		doc.moveDown(3);
		doc.fontSize(18); 
		writeLine(line.trim(), {align:'center',paragraphGap:14});
		doc.fontSize(fontSize); 
	}

	self.IssueNumber = function(line) { writeLine("Issue " + line.trim(), {align:'center',paragraphGap:12}); }

	self.IssueTitle = function(line) { writeLine("\"" + line.trim() + "\"", {align:'center',paragraphGap:12}); }

	self.Credit = function(line) { writeLine(line.trim(), {align:'center',paragraphGap:12}); }

	self.Author = function(line) { writeLine(line.trim(), {align:'center',paragraphGap:12}); }

	self.Description = function(line) { writeLine(line.trim(), {paragraphGap:12}); }


	self.DraftInfo = function(line) {
		doc.moveDown(4);
		var dt = new Date();
		var fmt = dt.toDateString();
		writeLine(line.trim() + " - " + fmt, {align:'center'});
	}

	self.Contact = function(line) {
		doc.text(line.trim(), 72, 684)
	}

	// Test for start of character dialog
	self.CharacterName = function(line) { 
		line = line.toUpperCase();
		writeLine(line, {indent: 180, underline: true}); //234 - 198
	}


	self.LetteringNote = function(line) {
		doc.font('Times-Bold');
		var y = doc.y, 
			width = 468 - 108;
		doc.text("NOTE: "+line, 108 + marginLeft, y, {lineGap:2, width:width});
		doc.x = marginLeft;
		doc.font('Times-Roman');
	}


	self.DialogParenthetical = function(line) { writeLine(line, {indent: 72}); }


	self.Dialog = function(line, bNum) {
		var y = doc.y, 
			width = 468 - 108;
		doc.text(bNum + " - " + line, 108 + marginLeft, y, {lineGap:2, width:width});
		doc.x = marginLeft;
	}


	// Default
	self.StandardLine = function(line) { 
		//doc.lineWidth(3);
		//writeLine(line, {paragraphGap:parGap,stroke:true}); 
		//doc.lineWidth(1);
		doc.font('Times-Bold');
		writeLine(line, {paragraphGap:parGap}); 
		doc.font('Times-Roman');
	}


	self.BlankLine = function() { doc.moveDown(); }

}


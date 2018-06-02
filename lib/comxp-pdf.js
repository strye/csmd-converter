/************
Format for Comics Expierience classes
Convert markdown to pdf
**************/

var fs  = require("fs");
var PDFDocument = require('pdfkit');
var doc;

exports = module.exports = function Converter(options)
{
	var self = this;

	var doc = new PDFDocument();

	var marginLeft = 72;
	var fontSize = 12;
	var parGap = 8;

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


	self.PrivateNote = function(line) {
		line = "[[" + line + "]]"
		doc.fontSize(14)
			.text(line, {lineGap:10})
			.fontSize(fontSize);

		if (line.length > 0) writeLine(line);
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
			.text("PANEL " + number, {lineGap:10})
			.font('Times-Roman');

		if (line.length > 0) writeLine(line.toUpperCase());
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
		doc.font('Times-Bold');
		writeLine(line, {paragraphGap:parGap}); 
		doc.font('Times-Roman');
	}


	// Title Page
	self.Title = function(line) { 
		doc.moveDown(12);
		doc.fontSize(16); 
		writeLine(line.trim(), {underline: true, paragraphGap:12});
		doc.fontSize(fontSize);
	}

	self.IssueNumber = function(line) { writeLine("Issue " + line.trim(), {paragraphGap:4}); }

	self.IssueTitle = function(line) { writeLine("\"" + line.trim() + "\"", {paragraphGap:4}); }

	self.Credit = function(line) { writeLine(line.trim(), {paragraphGap:4}); }

	self.Author = function(line) { writeLine("by " + line.trim(), {paragraphGap:4}); }

	self.Description = function(line) { writeLine(line.trim(), {paragraphGap:4}); }

	self.DraftInfo = function(line) {
		var dt = new Date();
		var fmt = dt.toDateString();
		writeLine("Last Revision - " + fmt);
	}

	self.Contact = function(line) {
		doc.text(line.trim(), 72, 684)
	}


	self.BlankLine = function() { doc.moveDown(); }

}


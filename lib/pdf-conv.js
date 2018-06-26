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
	var creator = options.creator || "Anonymous"


	var writeLine = function(line, options){
		var opts = {lineGap:4};
		if (options) { 
			opts = options;
			opts.lineGap = 4;
		}

		doc.text(line, opts);
	}
	var resetNormalText = function() {
		doc.font('Times-Roman')
			.fontSize(fontSize)
			.fillColor('#000000');
		doc.x = marginLeft;
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


		// Set Meta
		doc.info.Creator = creator

	}
	self.Cleanup = function() {
		doc.end();
	}


	self.Comment = function(line) {
		//writeLine(line, 'comment');
		doc.fillColor('#006000')
			.font("Times-Italic")
			.text(line, {lineGap:4});
		resetNormalText();
	}


	self.PrivateNote = function(line) {
		doc.fontSize(14)
			.font("Times-BoldItalic")
			.fillColor('#600000')
			.text("[[" + line + "]]", {lineGap:4});

		resetNormalText();
	}


	// Page Marker
	self.PageHeading = function(line, number) {
		doc.addPage()
			.fontSize(14)
			.font('Times-Bold')
			.text("PAGE " + number, {underline: true, lineGap:6});
			
		resetNormalText();
	}



	// Panel Marker
	self.PanelHeading = function(line, number) { 
		doc.moveDown(2);
		doc.font('Times-Bold')
			.text("PANEL " + number, {lineGap:6});
			
		resetNormalText();
	}




	// Test for start of character dialog
	self.GeneralDialog = function(dNum, name, dialog) {
		var y = doc.y, 
			width = 468 - 72;

		doc.font('Times-Bold')
			.text(dNum + ") ", (72 + marginLeft), y, {lineGap:6, width:width, continued: true})
			.text(name.toUpperCase() + ": ", {continued: true})
			.font('Times-Roman')
			.text(dialog.trim());

		resetNormalText();
	}

	self.CharacterName = function(line) { 
		line = line.toUpperCase();
		doc.moveDown(2);
		doc.text(line, {indent: 180, underline: true, lineGap:6});
			
		resetNormalText();
	}


	self.LetteringNote = function(line) {
		doc.font('Times-BoldItalic');
		var y = doc.y, 
			width = 468 - 72;
		doc.fillColor('#000060').text("NOTE: "+line, (72 + marginLeft), y, {lineGap:2, width:width});
			
		resetNormalText();
	}


	self.DialogParenthetical = function(line) { writeLine(line, {indent: 72}); }


	self.Dialog = function(line) {
		var y = doc.y, 
			width = 468 - 108;
		doc.text(line, (108 + marginLeft), y, {lineGap:2, width:width});
			
		resetNormalText();
	}


	// Default
	self.StandardLine = function(line) { 
		doc.font('Times-Bold')
			.text(line, {lineGap:6, paragraphGap:parGap});
			
		resetNormalText();
	}


	// Title Page
	self.Title = function(line) { 
		doc.moveDown(3);
		doc.fontSize(18); 
		writeLine(line.trim(), {align:'center',paragraphGap:14});
		doc.fontSize(fontSize); 
	}

	self.IssueNumber = function(line) { writeLine(line.trim(), {align:'center',paragraphGap:12}); }

	self.IssueTitle = function(line) { writeLine(line.trim(), {align:'center',paragraphGap:12}); }

	self.Credit = function(line) { writeLine(line.trim(), {paragraphGap:4}); }

	self.Author = function(line) { writeLine(line.trim(), {paragraphGap:4}); }


	self.Story = function(line) { writeLine(line.trim(), {paragraphGap:4}); }
	self.Writer = function(line) { writeLine(line.trim(), {paragraphGap:4}); }
	self.Letterer = function(line) { writeLine(line.trim(), {paragraphGap:4}); }
	self.Artist = function(line) { writeLine(line.trim(), {paragraphGap:4}); }
	self.Pencils = function(line) { writeLine(line.trim(), {paragraphGap:4}); }
	self.Ink = function(line) { writeLine(line.trim(), {paragraphGap:4}); }
	self.Color = function(line) { writeLine(line.trim(), {paragraphGap:4}); }



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


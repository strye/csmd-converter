/*****************************************
Format for Comics Expierience classes
Convert markdown to word docx
******************************************/

var fs  = require("fs");
const DOCXDocument = require("docx");
var doc;

exports = module.exports = function Converter(options)
{
	var self = this;


	var marginLeft = 1500;
	var fontSize = 12;
	var parGap = 8;

	var outputFile = options.outputFile || "output.docx"
	var creator = options.creator || "Anonymous"


	self.Setup = function() {  
		// Delete file if it exists
		try {
			fs.unlinkSync(outputFile)
		} catch (e) {
			if (!e.errno === -2) console.log(e)
		}

		// Setup file
		doc = new DOCXDocument.Document({
			creator: creator
		});

		doc.Styles.createParagraphStyle('Heading1', 'Heading 1')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.size((fontSize + 2)*2)
			.bold()
			.underline('single', '000000')
			.spacing({after: 120});
	
		doc.Styles.createParagraphStyle('Heading2', 'Heading 2')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.size((fontSize + 1)*2)
			.bold()
			.italics()
			.spacing({before: 240, after: 120});
		
		doc.Styles.createParagraphStyle('aside', 'Aside')
			.basedOn('Normal')
			.next('Normal')
			.size(fontSize*2)
			.color('006000')
			.bold()
			.italics()
			.spacing({before: 240, after: 240});
		
		doc.Styles.createParagraphStyle('private', 'Private')
			.basedOn('Normal')
			.next('Normal')
			.size((fontSize+ 0.5)*2)
			.color('600000')
			.bold()
			.italics()
			.spacing({before: 240, after: 240});
		
		doc.Styles.createParagraphStyle('character', 'Character Header')
			.basedOn('Normal')
			.bold()
			.allCaps()
			.size(fontSize*2)
			.indent({"left": marginLeft + 720})
			.spacing({line: 276, before: 72});
		
		doc.Styles.createParagraphStyle('dialog', 'Dialog')
			.basedOn('Normal')
			.indent({left: 3600, hanging: 2880})
			.size(fontSize*2)
			.spacing({line: 276, after: 144});

		doc.Styles.createParagraphStyle('lettering', 'Lettering Note')
			.basedOn('Normal')
			.indent({"left": 3600, hanging: 2880})
			.bold()
			.color('000060')
			.size(fontSize*2)
			.spacing({line: 276, before: 72, after: 72});			

		doc.Styles.createParagraphStyle('standard', 'Standard Script Text')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.size(fontSize*2)
			.spacing({after: 144});

		doc.Styles.createParagraphStyle('Title', 'Title')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.center()
			.size((fontSize + 6)*2)
			.allCaps()
			.bold()
			.underline('single', '000000')
			.spacing({before:720, after: 240});
	}
	self.Cleanup = function() {
		const exporter = new DOCXDocument.LocalPacker(doc);
		exporter.pack(outputFile);
	}


	self.Comment = function(line) {
		doc.createParagraph(line.trim()).style('aside');
	}

	self.PrivateNote = function(line) {
		line = "[[" + line + "]]"
		doc.createParagraph(line.trim()).style('private');
	}



	// Page Marker
	self.PageHeading = function(line, number, panels) {
		doc.createParagraph().pageBreak();
		if (line.length > 0) {
			doc.createParagraph(line.toUpperCase()).heading1();
			//doc.createParagraph(line.toUpperCase()).heading1().pageBreakBefore();
		} else {
			let hd1 = "PAGE " + number;
	 		if (panels && panels > 0) hd1 += " (" + panels + " panels)"
			doc.createParagraph(hd1).heading1();
		}
	}



	// Panel Marker
	self.PanelHeading = function(line, number) { 
		if (line.length > 0) {
			doc.createParagraph(line.toUpperCase()).heading2();
		} else {
			doc.createParagraph("PANEL " + number).heading2();
		}
	}




	// Test for start of character dialog
	self.GeneralDialog = function(dNum, name, dialog) {
		var paragraph = new DOCXDocument.Paragraph(dNum + ") ").style('dialog');
		paragraph.addRun(new DOCXDocument.TextRun(name).smallCaps().underline());
		paragraph.addRun(new DOCXDocument.TextRun(dialog).tab());
		
		doc.addParagraph(paragraph);
	}


	self.CharacterName = function(line) { 
		doc.createParagraph(line.toUpperCase()).style('character');
	}


	self.LetteringNote = function(line) {
		doc.createParagraph(line).style('lettering');
	}


	self.DialogParenthetical = function(line) { 
		doc.createParagraph(line).style('lettering');
	}


	self.Dialog = function(line) {
		doc.createParagraph(line).style('dialog');
	}


	// Default
	self.StandardLine = function(line) { 
		doc.createParagraph(line).style('standard');
	}


	// Title Page
	self.Title = function(line) { 
		doc.createParagraph(line.trim()).title();
	}

	self.IssueNumber = function(line) { 
		doc.createParagraph(line.trim()).center().style('standard');
	}

	self.IssueTitle = function(line) {
		doc.createParagraph(line.trim()).center().style('standard');
	}

	self.Credit = function(line) { 
		doc.createParagraph(line.trim()).style('standard');
	}

	self.Author = function(line) { 
		doc.createParagraph(line.trim()).style('standard');
	}


	self.Story = function(line) { doc.createParagraph(line.trim()).style('standard'); }
	self.Writer = function(line) { doc.createParagraph(line.trim()).style('standard'); }
	self.Letterer = function(line) { doc.createParagraph(line.trim()).style('standard'); }
	self.Artist = function(line) { doc.createParagraph(line.trim()).style('standard'); }
	self.Pencils = function(line) { doc.createParagraph(line.trim()).style('standard'); }
	self.Ink = function(line) { doc.createParagraph(line.trim()).style('standard'); }
	self.Color = function(line) { doc.createParagraph(line.trim()).style('standard'); }


	self.Description = function(line) { 
		doc.createParagraph(line.trim()).style('standard');
	}

	self.DraftInfo = function(line) {
		var dt = new Date();
		var fmt = dt.toDateString();
		doc.createParagraph("Last Revision - " + fmt).style('standard');
	}

	self.Contact = function(line) {
		doc.createParagraph("Contact: " + line.trim()).style('standard').spacing({before: 8640});
	}


	self.BlankLine = function() { doc.createParagraph(''); }

}


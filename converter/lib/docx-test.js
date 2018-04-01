/*****************************************
Format for Comics Expierience classes
Convert markdown to word docx
******************************************/

exports = module.exports = function Converter(options)
{
	var self = this;



	var writeLine = function(line, options){
	}

	self.Setup = function() {
		const docx = require('docx');
		const doc = new docx.Document({
			creator: 'Clippy',
			title: 'Sample Document',
			description: 'A brief example of using docx',
		});

		//const styles = new docx.Styles();
		doc.Styles.createParagraphStyle('Heading1', 'Heading 1')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.size(28)
			.bold()
			.italics()
			.spacing({after: 120});
		
		doc.Styles.createParagraphStyle('Heading2', 'Heading 2')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.size(26)
			.bold()
			.underline('double', 'FF0000')
			.spacing({before: 240, after: 120});
		
		doc.Styles.createParagraphStyle('aside', 'Aside')
			.basedOn('Normal')
			.next('Normal')
			.color('999999')
			.italics()
			.indent(720)
			.spacing({line: 276});
		
		doc.Styles.createParagraphStyle('wellSpaced', 'Well Spaced')
			.basedOn('Normal')
			.spacing({line: 276, before: 20 * 72 * .1, after: 20 * 72 * .05});
		
		doc.Styles.createParagraphStyle('ListParagraph', 'List Paragraph')
			.quickFormat()
			.basedOn('Normal');
		
		
		const numbering = new docx.Numbering();
		const numberedAbstract = numbering.createAbstractNumbering();
		numberedAbstract.createLevel(0, "lowerLetter", "%1)", "left");
		
		
		doc.createParagraph('Test heading1, bold and italicized').heading1();
		doc.createParagraph('Some simple content');
		doc.createParagraph('Test heading2 with double red underline').heading2();
		
		const letterNumbering = numbering.createConcreteNumbering(numberedAbstract);
		['Option1', 'Option 2', 'Option 3'].forEach((opt) =>
			doc.createParagraph(opt).setNumbering(letterNumbering, 0)
		);
		
		doc.createParagraph()
			.createTextRun('Some monospaced content')
			.font('Monospace');
		
		doc.createParagraph('An aside, in light gray italics and indented').style('aside');
		doc.createParagraph('This is normal, but well-spaced text').style('wellSpaced');
		doc.createParagraph('This is normal');
		
		
		const exporter = new docx.LocalPacker(doc);
		exporter.pack('test.docx');
	}


	self.Cleanup = function() {
	}


	self.Comment = function(line) {
	}




	// Page Marker
	self.PageHeading = function(line, number) {
	}



	// Panel Marker
	self.PanelHeading = function(line, number) { 
	}




	// Test for start of character dialog
	self.CharacterName = function(line) { 
	}


	self.LetteringNote = function(line) {
	}


	self.DialogParenthetical = function(line) { 
	}


	self.Dialog = function(line, bNum) {
	}


	// Default
	self.StandardLine = function(line) { 
	}


	// Title Page
	self.Title = function(line) { 
	}

	self.IssueNumber = function(line) { 
	}

	self.IssueTitle = function(line) {
	}

	self.Credit = function(line) { 
	}

	self.Author = function(line) { 
	}

	self.Description = function(line) { 
	}

	self.DraftInfo = function(line) {
	}

	self.Contact = function(line) {
	}


	self.BlankLine = function() { }

}


/*****************************************
Format for Comics Expierience classes
Convert markdown to word docx
******************************************/
const ConverterBase = require("./cnvrtr-base"),
fs  = require("fs"),
DOCXDocument = require("docx");

class DocxConverter extends ConverterBase { 
	constructor(options = {}) {
		super('docx', options);

		this._doc = null;
		this._marginLeft = 1500;
		this._fontSize = 12;
		this._creator = options.creator || "Anonymous"
	}

	writeLine(line, type='') {
		let style = 'standard'

		if (type === 'panel') style = 'heading2'
		if (type === 'pvt-note') { style = 'private'; }
		if (type === 'art-note') style = 'aside'
		if (type === 'ltr-note') style = 'lettering'

		this._doc.createParagraph(line).style(style);
	}

	Setup() {
		// Delete file if it exists
		try { fs.unlinkSync(this._outputFile) } 
		catch (e) { if (!e.errno === -2) console.log(e) }

		// Setup file
		this._doc = new DOCXDocument.Document({
			creator: this._creator
		});

		this._doc.Styles.createParagraphStyle('Heading1', 'Heading 1')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.size((this._fontSize + 2)*2)
			.bold()
			.underline('single', '000000')
			.spacing({after: 120});
	
		this._doc.Styles.createParagraphStyle('Heading2', 'Heading 2')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.size((this._fontSize + 1)*2)
			.bold()
			.italics()
			.spacing({before: 240, after: 120});
		
		this._doc.Styles.createParagraphStyle('aside', 'Aside')
			.basedOn('Normal')
			.next('Normal')
			.size(this._fontSize*2)
			.color('006000')
			.bold()
			.italics()
			.spacing({before: 240, after: 240});
		
		this._doc.Styles.createParagraphStyle('private', 'Private')
			.basedOn('Normal')
			.next('Normal')
			.size((this._fontSize+ 0.5)*2)
			.color('600000')
			.bold()
			.italics()
			.spacing({before: 240, after: 240});
		
		this._doc.Styles.createParagraphStyle('character', 'Character Header')
			.basedOn('Normal')
			.bold()
			.allCaps()
			.size(this._fontSize*2)
			.indent({"left": this._marginLeft + 720})
			.spacing({line: 276, before: 72});
		
		this._doc.Styles.createParagraphStyle('dialog', 'Dialog')
			.basedOn('Normal')
			.indent({left: 3600, hanging: 2880})
			.size(this._fontSize*2)
			.spacing({line: 276, after: 144});

		this._doc.Styles.createParagraphStyle('lettering', 'Lettering Note')
			.basedOn('Normal')
			.indent({"left": 3600, hanging: 2880})
			.bold()
			.color('000060')
			.size(this._fontSize*2)
			.spacing({line: 276, before: 72, after: 72});			

		this._doc.Styles.createParagraphStyle('standard', 'Standard Script Text')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.size(this._fontSize*2)
			.spacing({after: 144});

		this._doc.Styles.createParagraphStyle('Title', 'Title')
			.basedOn("Normal")
			.next("Normal")
			.quickFormat()
			.center()
			.size((this._fontSize + 6)*2)
			.allCaps()
			.bold()
			.underline('single', '000000')
			.spacing({before:720, after: 240});
		
	}
	Cleanup() {
		const exporter = new DOCXDocument.LocalPacker(this._doc);
		exporter.pack(this._outputFile);
	}

	PageHeading(line, number, panels) {
		this._doc.createParagraph().pageBreak();
		if (line.length > 0) {
			this._doc.createParagraph(line.toUpperCase()).heading1();
		} else {
			let hd1 = "PAGE " + number;
	 		if (panels && panels > 0) hd1 += " (" + panels + " panels)"
			 this._doc.createParagraph(hd1).heading1();
		}
	}
	GeneralDialog(dNum, name, dialog) {
		let paragraph = new DOCXDocument.Paragraph(dNum + ") ").style('dialog');
		paragraph.addRun(new DOCXDocument.TextRun(name).smallCaps().underline());
		paragraph.addRun(new DOCXDocument.TextRun(dialog).tab());
		
		this._doc.addParagraph(paragraph);
	}

	// Title Page
	Title(line) { this._doc.createParagraph(line.trim()).title(); }
	IssueNumber(line) { this._doc.createParagraph(line.trim()).center().style('standard'); }
	IssueTitle(line) { this._doc.createParagraph(line.trim()).center().style('standard'); }
	Contact(line) { this._doc.createParagraph(line.trim()).style('standard').spacing({before: 5640}); }
}

module.exports = DocxConverter


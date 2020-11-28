/************
Format for Comics Expierience classes
Convert markdown to pdf
**************/
const ConverterBase = require("./cnvrtr-base"),
fs  = require("fs"),
PDFDocument = require('pdfkit');

class PDFConverter extends ConverterBase { 
	constructor(options = {}) {
		super('pdf', options);

		this._doc = null;
		this._marginLeft = 72;
		this._fontSize = 12;
		this._parGap = 8;
		this._creator = options.creator || "Anonymous"
	}

	writeLine(line, type='') {
		let options = {lineGap:4};
		if (type === 'meta') options.paragraphGap = 4;
		this._doc.text(line, options);
	}
	writeCustom = function(line, options){
		var opts = {lineGap:4};
		if (options) { 
			opts = options;
			opts.lineGap = 4;
		}

		this._doc.text(line, opts);
	}
	resetNormalText() {
		this._doc.font('Times-Roman')
			.fontSize(this._fontSize)
			.fillColor('#000000');
		this._doc.x = this._marginLeft;
	}


	Setup() {
		// Delete file if it exists
		try {
			fs.unlinkSync(this._outputFile)
		} catch (e) {
			if (!e.errno === -2) console.log(e)
		}

		// Setup file
		this._doc = new PDFDocument();
		this._doc.pipe(fs.createWriteStream(this._outputFile));

		// Set Fonts
		//doc.font('Courier', fontSize);
		this._doc.font('Times-Roman', this._fontSize);

		// Set Meta
		this._doc.info.Creator = this._creator
	}
	Cleanup() {
		this._doc.end();
	}

	PrivateNote(line) { 
		this._doc.fontSize(14)
		.font("Times-BoldItalic")
		.fillColor('#600000')
		.text(line, {lineGap:4});

		this.resetNormalText();
	}
	ArtistNote(line) { 
		this._doc.fillColor('#006000')
		.font("Times-Italic")
		.text(line, {lineGap:4});
		this.resetNormalText();	
	 }
	LetteringNote(line) { 
		this._doc.font('Times-BoldItalic');
		let y = this._doc.y, width = 468 - 72;
		this._doc.fillColor('#000060').text("NOTE: "+line, (72 + this._marginLeft), y, {lineGap:2, width:width});
			
		this.resetNormalText();
	 }

	PageHeading(line, number, panels) {
		let hd1 = "";
		if (line && line.length > 0) {
			hd1 = line.toUpperCase();
		} else {
			hd1 = "PAGE " + number;
			if (panels && panels > 0) hd1 += " (" + panels + " panels)"
		}

		this._doc.addPage()
			.fontSize(14)
			.font('Times-Bold')
			.text(hd1, {underline: true, lineGap:6});
			
		this.resetNormalText();
	}
	PanelHeading(line, number) {
		this._doc.moveDown(2);
		this._doc.font('Times-Bold')
			.text("PANEL " + number, {lineGap:6});
			
		this.resetNormalText();
	}
	GeneralDialog(dNum, name, dialog) {
		let y = this._doc.y, 
		width = 468 - 72;

		this._doc.font('Times-Bold')
		.text(dNum + ") ", (72 + this._marginLeft), y, {lineGap:6, width:width, continued: true})
		.text(name.toUpperCase() + ": ", {continued: true})
		.font('Times-Roman')
		.text(dialog.trim());

		this.resetNormalText();
	}
	StandardLine(line) { 
		this._doc.font('Times-Bold')
		.text(line, {lineGap:6, paragraphGap:this._parGap});
		
		this.resetNormalText();
	}
	BlankLine() { this._doc.moveDown(); }


	// Title Page
	Title(line) { 
		this._doc.moveDown(3);
		this._doc.fontSize(18); 
		this.writeCustom(line.trim(), {align:'center',paragraphGap:14});
		this._doc.fontSize(this._fontSize); 
	}
	IssueNumber(line) { this.writeCustom(line.trim(), {align:'center',paragraphGap:12}); }
	IssueTitle(line) { this.writeCustom(line.trim(), {align:'center',paragraphGap:12}); }
	Contact(line) { this._doc.text(line.trim(), 72, 684); }
}

module.exports = PDFConverter


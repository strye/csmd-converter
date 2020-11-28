const fs  = require("fs"),
ConverterBase = require("./cnvrtr-base");

class TextConverter extends ConverterBase { 
	constructor(options = {}) {
		super('txt', options);
	}
	writeLine(line, type='') {
		let leading = "";
		if (type === 'meta') leading = " ".repeat(30)
		if (type === 'pvt-note') leading = `NOTE TO SELF: `
		if (type === 'art-note') leading = `ARTIST NOTE: `
		if (type === 'ltr-note') leading = `${" ".repeat(15)}LETTERING NOTE: `

		let print = `${leading}${line}`;
		fs.appendFileSync(this._outputFile, print.toString() + "\n");

		if (type === 'pvt-note' || type === 'art-note' || type === 'ltr-note') {
			fs.appendFileSync(this._outputFile, "\n");
		}
	}

	Setup() {
		// Delete file if it exists
		try {
			fs.unlinkSync(this._outputFile)
		} catch (e) {
			if (!e.errno === -2) console.log(e)
		}		
	}
	//Cleanup() {}

	// PrivateNote(line) {}
	// ArtistNote(line) {}
	// LetteringNote(line) {}

	// PageHeading(line, number, panels) {}
	// PanelHeading(line, number) {}

	GeneralDialog(dNum, name, dialog) {
		this.writeLine(" ".repeat(15) + dNum + ") " + name.toUpperCase() + ":" + " ".repeat(5) + dialog);
		this.writeLine("");
	}

	// Default
	// StandardLine(line) { writeLine(line); }
	// BlankLine() { writeLine("") }


	// // Title Page
	// Title(line) {}
	// IssueNumber(line) {}
	// IssueTitle(line) {}
	// Description(line) {}
	// Credit(line) {}
	// Story(line) {}
	// Writer(line) {}
	// Artist(line) {}
	// Letterer(line) {}
	// Color(line) {}
	// Pencils(line) {}
	// Ink(line) {}
	Version(line) {
		this.writeLine("");
		this.writeLine("");
		this.writeLine("");
		this.writeLine(" ".repeat(10) + line.trim());
	}
	DraftDate(line) {
		this.writeLine(" ".repeat(10) + line.trim());
	}
	DraftInfo(line) {
		this.writeLine(" ".repeat(10) + line.trim());
	}
	Contact(line) {
		this.writeLine("");
		this.writeLine("");
		this.writeLine("");
		this.writeLine(line.trim());
	}

}

module.exports = TextConverter


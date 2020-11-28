


class ConverterBase { 
	constructor(ext, options = {}) {
		this._fileType
		this._outputFile = options.outputFile || `./output.${ext}`
	}

	writeLine(line, type='') {}

	Setup() {}
	Cleanup() {}
	PrivateNote(line) { this.writeLine(`[[${line}]]`, 'pvt-note') }
	ArtistNote(line) { this.writeLine(line, 'art-note') }
	LetteringNote(line) { this.writeLine(line, 'ltr-note'); }

	PageHeading(line, number, panels) {
		this.writeLine(`PAGE ${number} (${panels} panels)`, 'page');
		if (line.length > 0) this.writeLine(line, 'pvt-note');
	}
	PanelHeading(line, number) {
		this.writeLine("PANEL " + number, 'panel'); 
		if (line.length > 0) writeLine(line, 'pvt-note');
	}
	GeneralDialog(dNum, name, dialog) {}
	StandardLine(line) { this.writeLine(line); }
	BlankLine() { this.writeLine("") }


	// Title Page
	Title(line) { this.writeLine(line.trim(), 'meta'); }
	IssueNumber(line) { this.writeLine(line.trim(), 'meta'); }
	IssueTitle(line) { this.writeLine(line.trim(), 'meta'); }
	Description(line) { this.writeLine(line.trim(), 'meta'); }
	Credit(line) { this.writeLine(line.trim(), 'meta'); }
	Story(line) { this.writeLine(line.trim(), 'meta'); }
	Writer(line) { this.writeLine(line.trim(), 'meta'); }
	Artist(line) { this.writeLine(line.trim(), 'meta'); }
	Letterer(line) { this.writeLine(line.trim(), 'meta'); }
	Color(line) { this.writeLine(line.trim(), 'meta'); }
	Pencils(line) { this.writeLine(line.trim(), 'meta'); }
	Ink(line) { this.writeLine(line.trim(), 'meta'); }
	Version(line) { this.writeLine(line.trim(), 'meta'); }
	DraftDate(line) { this.writeLine(line.trim(), 'meta'); }
	DraftInfo(line) { this.writeLine(line.trim(), 'meta'); }
	Contact(line) { this.writeLine(line.trim(), 'meta'); }
}

module.exports = ConverterBase

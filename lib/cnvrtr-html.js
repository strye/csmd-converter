const ConverterBase = require("./cnvrtr-base"),
fs  = require("fs");


class HTMLConverter extends ConverterBase { 
	constructor(options = {}) {
		super('html', options);
	}

	writeLine(line, type='') {
		let hClass = "", htmlClass = "standard";

		if (type === 'meta') hClass = ''
		if (type === 'page') hClass = 'pageHeading'
		if (type === 'panel') hClass = 'panelHeading'
		if (type === 'pvt-note') hClass = 'private';
		if (type === 'art-note') hClass = 'art-note'
		if (type === 'ltr-note') hClass = 'letter-note'


		if (hClass.length > 0) htmlClass = "class='" + hClass + "'";
		let out = "<div " + htmlClass + ">" + line.toString() + "</div>";

		fs.appendFileSync(this._outputFile, out + "\n");
	}
	writeCustom(line, hClass){
		var htmlClass = "";
		if (hClass) htmlClass = "class='" + hClass + "'";
		var out = "<div " + htmlClass + ">" + line.toString() + "</div>";

		fs.appendFileSync(this._outputFile, out + "\n");
	}


	Setup() {
		// Delete file if it exists
		try {
			fs.unlinkSync(this._outputFile)
		} catch (e) {
			if (!e.errno === -2) console.log(e)
		}

		// Setup file
		fs.createReadStream('./htmlheader.txt').pipe(fs.createWriteStream(this._outputFile));		
	}
	Cleanup() {
		this.writeLine("&nbsp;", 'spacer')

		fs.appendFileSync(this._outputFile, "</body> \n");
		fs.appendFileSync(this._outputFile, "</html> \n");
	}

	GeneralDialog(dNum, name, dialog) {
		let c = dNum + ") " + name.toUpperCase(),
		dlg = "<table><tr><td class='char-name'>" + c + "</td><td>" + dialog + "</td></tr></table>"	
		this.writeCustom(dlg, 'dialog');
	}
	BlankLine() { this.writeLine("&nbsp;") }


	// Title Page
	Title(line) { this.writeCustom(line.trim(), 'titlePage title'); }
	IssueTitle(line) { this.writeCustom(line.trim(), 'titlePage issueTitle'); }
	Version(line) { this.writeCustom(line.trim(), 'spacer titlePage'); }
	Contact(line) { this.writeCustom(line.trim(), 'spacer'); }

}

module.exports = HTMLConverter


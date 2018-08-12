var fs  = require("fs");
var chalk = require('chalk');


exports = module.exports = function Converter(options)
{
	var self = this;

	var outputFile = options.outputFile || "./output.html"

	var writeLine = function(line, hClass){
		var htmlClass = "";
		if (hClass) htmlClass = "class='" + hClass + "'";
		var out = "<div " + htmlClass + ">" + line.toString() + "</div>";

		fs.appendFileSync(outputFile, out + "\n");
	}

	self.Setup = function() {  
		// Delete file if it exists
		try {
			fs.unlinkSync(outputFile)
		} catch (e) {
			if (!e.errno === -2) console.log(e)
		}

		// Setup file
		fs.createReadStream('./htmlheader.txt').pipe(fs.createWriteStream(outputFile));


	}
	self.Cleanup = function() {
		writeLine("&nbsp;", 'spacer')

		fs.appendFileSync(outputFile, "</body> \n");
		fs.appendFileSync(outputFile, "</html> \n");
	}


	self.Comment = function(line) {
		writeLine(line, 'comment');
	}

	self.PrivateNote = function(line) {
		line = "[[" + line + "]]"
		writeLine(line, 'private');
	}

	// Page Marker
	self.PageHeading = function(line, number, panels) {
		writeLine("PAGE " + number + " (" + panels + " panels)", 'pageHeading');

		if (line.length > 0) writeLine(line);
	}



	// Panel Marker
	self.PanelHeading = function(line, number) { 
		writeLine("PANEL " + number, 'panelHeading'); 

		if (line.length > 0) writeLine(line);
	}



	// Title Page
	self.Title = function(line) { writeLine(line.trim(), 'titlePage title'); }

	self.IssueNumber = function(line) { writeLine(line.trim(), 'titlePage'); }

	self.IssueTitle = function(line) { writeLine(line.trim(), 'titlePage issueTitle'); }

	self.Credit = function(line) { writeLine(line.trim(), 'titlePage'); }
	self.Author = function(line) { writeLine(line.trim(), 'titlePage'); }


	self.Story = function(line) { writeLine(line.trim(), 'titlePage'); }
	self.Writer = function(line) { writeLine(line.trim(), 'titlePage'); }
	self.Letterer = function(line) { writeLine(line.trim(), 'titlePage'); }
	self.Artist = function(line) { writeLine(line.trim(), 'titlePage'); }
	self.Pencils = function(line) { writeLine(line.trim(), 'titlePage'); }
	self.Ink = function(line) { writeLine(line.trim(), 'titlePage'); }
	self.Color = function(line) { writeLine(line.trim(), 'titlePage'); }



	self.Description = function(line) { writeLine(line.trim(),'titlePage'); }


	self.DraftInfo = function(line) {
		writeLine(line.trim(), 'spacer titlePage');
	}

	self.Contact = function(line) {
		writeLine(line.trim(), 'spacer');
	}

	// Test for start of character dialog
	self.GeneralDialog = function(dNum, name, dialog) {
		var c = dNum + ") " + name.toUpperCase();
		var dlg = "<table><tr><td class='char-name'>" + c + "</td><td>" + dialog + "</td></tr></table>"
	
		writeLine(dlg, 'dialog');
	}

	self.CharacterName = function(line) { writeLine(line, 'characterName'); }


	self.DialogParenthetical = function(line) { writeLine(line, 'dialogParenthetical'); }


	self.Dialog = function(line) { writeLine(line, 'dialog'); }


	// Default
	self.StandardLine = function(line) { writeLine(line, 'bold'); }


	self.BlankLine = function() { writeLine("&nbsp;") }

}


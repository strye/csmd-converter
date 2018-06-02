var fs  = require("fs");
var chalk = require('chalk');


exports = module.exports = function Converter(options)
{
	var self = this;

	var outputFile = options.outputFile || "./output.txt"

	var writeLine = function(line){
		fs.appendFileSync(outputFile, line.toString() + "\n");
	}

	self.Setup = function() {  
		// Delete file if it exists
		try {
			fs.unlinkSync(outputFile)
		} catch (e) {
			if (!e.errno === -2) console.log(e)
		}
	}
	self.Cleanup = function() {  }


	self.Comment = function(line) {
		writeLine(line);
	}
	self.PrivateNote = function(line) {
		line = "[[" + line + "]]"
		writeLine(line);
	}


	// Page Marker
	self.PageHeading = function(line, number) {
		writeLine("PAGE " + number);

		if (line.length > 0) writeLine(line);
	}



	// Panel Marker
	self.PanelHeading = function(line, number) { 
		writeLine("PANEL " + number); 

		if (line.length > 0) writeLine(line);
	}



	// Title Page
	self.Title = function(line) { writeLine(" ".repeat(30) + line.trim()); }

	self.IssueNumber = function(line) { writeLine(" ".repeat(30) + "Issue " + line.trim()); }

	self.IssueTitle = function(line) { writeLine(" ".repeat(30) + "\"" + line.trim() + "\""); }

	self.Credit = function(line) { writeLine(" ".repeat(30) + line.trim()); }

	self.Author = function(line) { writeLine(" ".repeat(30) + line.trim()); }

	self.Description = function(line) { writeLine(" ".repeat(30) + line.trim()); }


	self.DraftInfo = function(line) {
		writeLine("");
		writeLine("");
		writeLine("");
		writeLine(" ".repeat(10) + line.trim());
	}

	self.Contact = function(line) {
		writeLine("");
		writeLine("");
		writeLine("");
		writeLine(line.trim());
	}

	// Test for start of character dialog
	self.CharacterName = function(line) { writeLine(" ".repeat(30) + line); }


	self.DialogParenthetical = function(line) { writeLine(" ".repeat(15) + line); }


	self.Dialog = function(line) { writeLine(" ".repeat(20) + line); }


	// Default
	self.StandardLine = function(line) { writeLine(line); }


	self.BlankLine = function() { writeLine("") }

}


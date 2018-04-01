var chalk = require('chalk');


exports = module.exports = function Converter()
{
	var self = this;



	self.Setup = function(options) {  }
	self.Cleanup = function(options) {  }


	self.Comment = function(line) {
		console.log(chalk.bgYellow.red(line));
	}


	// Page Marker
	self.PageHeading = function(line, number) {
		console.log(chalk.bold.yellow("PAGE " + number));

		if (line.length > 0) console.log(line);
	}



	// Panel Marker
	self.PanelHeading = function(line, number) { 
		console.log(chalk.underline.cyan("PANEL " + number)); 

		if (line.length > 0) console.log(line);
	}



	// Title Page
	self.Title = function(line) { console.log(" ".repeat(30) + chalk.bgWhite.blue(line.trim())); }

	self.IssueNumber = function(line) { console.log(" ".repeat(30) + "Issue " + line.trim()); }

	self.IssueTitle = function(line) { console.log(" ".repeat(30) + "\"" + line.trim() + "\""); }

	self.Credit = function(line) { console.log(" ".repeat(30) + line.trim()); }

	self.Author = function(line) { console.log(" ".repeat(30) + line.trim()); }

	self.Description = function(line) { console.log(" ".repeat(30) + line.trim()); }


	self.DraftInfo = function(line) {
		console.log("");
		console.log("");
		console.log("");
		console.log(" ".repeat(10) + line.trim());
	}

	self.Contact = function(line) {
		console.log("");
		console.log("");
		console.log("");
		console.log(line.trim());
	}

	// Test for start of character dialog
	self.CharacterName = function(line) { console.log(" ".repeat(30) + chalk.bgWhite.blue(line)); }


	self.DialogParenthetical = function(line) { console.log(" ".repeat(15) + line); }


	self.Dialog = function(line) { console.log(" ".repeat(20) + line); }


	// Default
	self.StandardLine = function(line) { console.log(line); }


	self.BlankLine = function() { console.log("") }



}


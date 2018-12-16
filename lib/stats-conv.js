var fs  = require("fs");

exports = module.exports = function Converter(options)
{
	var self = this;

	var outputFile = options.outputFile || "./stats.csv"
	var statTots = {
			page: 0,
			panel: 0,
			dialog: 0,
			words: 0
		};

	var writeLine = function(){
		let statLine = statTots.page + "," + statTots.panel + "," + statTots.dialog + "," + statTots.words + "\n"
		fs.appendFileSync(outputFile, statLine);
		statTots.dialog = 0;
		statTots.words = 0;
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




	// Page Marker
	self.PageHeading = function(line, number, panels) {
		if (statTots.page > 0) {
			// clear final panel
			writeLine();
		}
		statTots.page++;
		statTots.panel = 0;
		statTots.dialog = 0;
		statTots.words = 0;
	}

	// Panel Marker
	self.PanelHeading = function(line, number) { 
		if (statTots.panel > 0) {
			// clear last panel
			writeLine();
		}
		statTots.panel++;
		statTots.dialog = 0;
		statTots.words = 0;
	}

	// dialog
	self.GeneralDialog = function(dNum, name, dialog) {
		wordCnt = dialog.split(" ").length
		statTots.dialog++;
		statTots.words += wordCnt;
	}


	self.Comment = function(line) {}
	self.PrivateNote = function(line) {}
	self.CharacterName = function(line) {}
	self.DialogParenthetical = function(line) {}
	self.Dialog = function(line) {}
	self.StandardLine = function(line) {}
	self.BlankLine = function() {}
	self.Title = function(line) {}
	self.IssueNumber = function(line) {}
	self.IssueTitle = function(line) {}
	self.Credit = function(line) {}
	self.Author = function(line) {}
	self.Story = function(line) {}
	self.Writer = function(line) {}
	self.Letterer = function(line) {}
	self.Artist = function(line) {}
	self.Pencils = function(line) {}
	self.Ink = function(line) {}
	self.Color = function(line) {}
	self.Description = function(line) {}
	self.DraftInfo = function(line) {}
	self.Contact = function(line) {}
}
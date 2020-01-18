

var titleCase = function(str) {
	return str.toLowerCase().split(' ').map(function(word) {
		if (word.startsWith("(") | word.endsWith(")")) {
			return word.toUpperCase()
		}
		//return word.replace(word[0], word[0].toUpperCase());
		return (word.charAt(0).toUpperCase() + word.slice(1));
	}).join(' ');
}

exports = module.exports = function(line, parseVars)
{
	let res = null;
	
	if (line.startsWith('/*')) parseVars.commentOn = true;

	if (parseVars.commentOn || line.startsWith('//') || line.startsWith('!==')) {
		// look for the comment clossing key
		var comm = line;
		if (line.startsWith('//') | line.startsWith('/*')) comm = line.substr(2)
		if (line.endsWith('*/')) {
			let strt = 0;
			if (line.startsWith('//') | line.startsWith('/*')) strt = 2
			let lng = (line.length - (2 + strt))
			comm = line.substr(strt, lng)
			parseVars.commentOn = false;
		}

		if (comm.trim().length > 0)
		res = { type: 'private', text: comm.trim() }
	}

	// Page Marker
	else if (line.charAt(0) === "#" && line.charAt(1) != "#") {
		parseVars.preScript = false;
		res = { type: 'page', text: line.substr(1) }
	} 
	
	// Panel Marker
	else if (line.startsWith('##') && line.charAt(2) != "#") {
		parseVars.preScript = false;
		res = { type: 'panel', text: line.substr(2) }
	}

	// Title Page
	else if (parseVars.preScript) {
		var lineUpper = line.toUpperCase().trim();
		if (lineUpper.startsWith('TITLE:')) {
			res = { type: 'meta', text: line.substr(6).trim(), attr: "title" }
		}
		if (lineUpper.startsWith('ISSUE:')) {
			res = { type: 'meta', text: "Issue #: " + line.substr(6).trim(), attr: "issueNo" }
		}
		if (lineUpper.startsWith('ISSUE TITLE:')) {
			res = { type: 'meta', text: "Title: \"" + line.substr(12).trim() + "\"", attr: "issueTitle" }
		}
		if (lineUpper.startsWith('CREDIT:')) {
			res = { type: 'meta', text: line.substr(7).trim(), attr: "credit" }
		}
		if (lineUpper.startsWith('AUTHOR:')) {
			res = { type: 'meta', text: line.substr(7).trim(), attr: "author" }
		}
		if (lineUpper.startsWith('DRAFT DATE:')) {
			res = { type: 'meta', text: line.substr(11).trim(), attr: "draft" }
		}
		if (lineUpper.startsWith('VERSION:')) {
			res = { type: 'meta', text: line.substr(8).trim(), attr: "version" }
		}
		if (lineUpper.startsWith('CONTACT:')) {
			res = { type: 'meta', text: line.substr(8).trim(), attr: "contact" }
		}
		if (lineUpper.startsWith('SCRIPT DESCRIPTION:')) {
			res = { type: 'meta', text: line.substr(19).trim(), attr: "description" }
		}
		if (lineUpper.startsWith('WRITER:')) {
			res = { type: 'meta', text: "Written by " + line.substr(7).trim(), attr: "writer" }
		}
		if (lineUpper.startsWith('STORY BY:')) {
			res = { type: 'meta', text: "Story by " + line.substr(9).trim(), attr: "story" }
		}
		if (lineUpper.startsWith('LETTERER:')) {
			res = { type: 'meta', text: "Letters by " + line.substr(9).trim(), attr: "letterer" }
		}
		if (lineUpper.startsWith('ARTIST:')) {
			res = { type: 'meta', text: "Art by " + line.substr(7).trim(), attr: "artist" }
		}
		if (lineUpper.startsWith('PENCILS:')) {
			res = { type: 'meta', text: "Penciled by " + line.substr(8).trim(), attr: "pencils" }
		}
		if (lineUpper.startsWith('INK:')) {
			res = { type: 'meta', text: "Inked by " + line.substr(4).trim(), attr: "ink" }
		}
		if (lineUpper.startsWith('COLOR:')) {
			res = { type: 'meta', text: "Colored by " + line.substr(6).trim(), attr: "color" }
		}
	}





	
	// Test for start of character dialog
	else if (line.startsWith('@')) {
		parseVars.dialogOn = true;
		
		parseVars.dialog.name = titleCase(line.substr(1)).trim();
		parseVars.dialog.text = ""
	} 


	// Character Dialog
	else if (parseVars.dialogOn) {
		if (line.length === 0) {
			res = { type: 'dialog', 
				name: parseVars.dialog.name, 
				text: parseVars.dialog.text.trim()
			}

			parseVars.dialogOn = false;
			parseVars.dialog = {};
			// return;
		} else { 
			if (parseVars.dialog.text) {
				parseVars.dialog.text += " " + line.trim();
			} else {
				parseVars.dialog.text = line.trim() + " ";
			}
		}
	} 

	// Letterer comment
	else if (line.startsWith('>>') && line.charAt(2) != ">") {
		res = { type: 'letnote', text: line.substr(2) }
	} 

	// Artist Comment
	else if (line.startsWith('<<') && line.charAt(2) != "<") {
		res = { type: 'comment', text: line.substr(2) }
	} 
	
	// Default
	else if (line && line.length>0) {
		res = { type: 'desc', text: line }
	}

	return res;
}


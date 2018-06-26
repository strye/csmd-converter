
var parseVars = {
	meta: {},
	commentOn: false,
	dialogOn: false,
	dialog: {},
	pageNum: 0,
	panelNum: 0,
	dialogNum: 0,
	pageJson: null
}


var titleCase = function(str) {
	return str.toLowerCase().split(' ').map(function(word) {
		if (word.startsWith("(") | word.endsWith(")")) {
			return word.toUpperCase()
		}
		//return word.replace(word[0], word[0].toUpperCase());
		return (word.charAt(0).toUpperCase() + word.slice(1));
	}).join(' ');
}

exports = module.exports = function ConvertLine(line, conv, mode)
{
	
	if (line.startsWith('/*')) parseVars.commentOn = true;

	if (parseVars.commentOn || line.startsWith('//')) {
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

		if (comm.trim().length > 0 && parseVars.pageJson)
			parseVars.pageJson.lines.push({ type: 'private', text: comm.trim() })
		return;
	}



	// Page Marker
	if (line.charAt(0) === "#" && line.charAt(1) != "#") {
		if (parseVars.pageJson) {
			conv.converter.PageHeading("", parseVars.pageJson.pageNo);
			parseVars.pageJson.lines.forEach(element => {
				switch (element.type) {
					case "panel":
						conv.converter.PanelHeading("", element.number);
						break;
					case "char":
						if (mode != 'a') conv.converter.CharacterName(element.text);
						break;
					case "dialog":
						// if (mode != 'a') conv.converter.Dialog(element.number + ") " + element.text);
						if (mode != 'a') conv.converter.GeneralDialog(element.number, element.name, element.text);
						break;
					case "paren":
						if (mode != 'a') conv.converter.DialogParenthetical(element.text);
						break;
					case "letnote":
						if (mode != 'a') conv.converter.LetteringNote(element.text);
						break;
					case "comment":
						if (mode != 'l') conv.converter.Comment(element.text);
						break;
					case "private":
						if (mode === 'f') conv.converter.PrivateNote(element.text);
						break;
					default:
						if (mode != 'l') conv.converter.StandardLine(element.text);
						break;
				}				
			});
		} else {
			writeMeta(conv.converter, parseVars.meta)
		}


		parseVars.pageNum++;
		parseVars.panelNum = 0;
		parseVars.dialogNum = 0;
		parseVars.pageJson = { pageNo: parseVars.pageNum, lines: [] };
	} 
	// Panel Marker
	else if (line.startsWith('##') && line.charAt(2) != "#") {
		parseVars.panelNum++;
		parseVars.pageJson.lines.push({ type: 'panel', number: parseVars.panelNum })
	}

	// Title Page
	else if (parseVars.pageNum === 0) {
		var lineUpper = line.toUpperCase();
		if (lineUpper.startsWith('TITLE:')) {
			parseVars.meta.title = line.substr(6).trim()
		}
		if (lineUpper.startsWith('ISSUE:')) {
			parseVars.meta.issueNo = "Issue #: " + line.substr(6).trim()
		}
		if (lineUpper.startsWith('ISSUE TITLE:')) {
			parseVars.meta.issueTitle = "Title: \"" + line.substr(12).trim() + "\"" 
		}
		if (lineUpper.startsWith('CREDIT:')) {
			parseVars.meta.credit = line.substr(7).trim()
		}
		if (lineUpper.startsWith('AUTHOR:')) {
			parseVars.meta.author = "by " + line.substr(7).trim()
		}
		if (lineUpper.startsWith('DRAFT DATE:')) {
			parseVars.meta.draft = line.substr(11).trim()
		}
		if (lineUpper.startsWith('CONTACT:')) {
			parseVars.meta.contact = line.substr(8).trim()
		}
		if (lineUpper.startsWith('SCRIPT DESCRIPTION:')) {
			parseVars.meta.description = line.substr(19).trim().trim()
		}
		if (lineUpper.startsWith('WRITER:')) {
			parseVars.meta.writer = "Written by " + line.substr(7).trim()
		}
		if (lineUpper.startsWith('STORY BY:')) {
			parseVars.meta.story = "Story by " + line.substr(9).trim()
		}
		if (lineUpper.startsWith('LETTERER:')) {
			parseVars.meta.letterer = "Letters by " + line.substr(9).trim()
		}
		if (lineUpper.startsWith('ARTIST:')) {
			parseVars.meta.artist = "Art by " + line.substr(7).trim()
		}
		if (lineUpper.startsWith('PENCILS:')) {
			parseVars.meta.pencils = "Penciled by " + line.substr(8).trim()
		}
		if (lineUpper.startsWith('INK:')) {
			parseVars.meta.ink = "Inked by " + line.substr(4).trim()
		}
		if (lineUpper.startsWith('COLOR:')) {
			parseVars.meta.color = "Colored by " + line.substr(6).trim()
		}
	}

	
	// Test for start of character dialog
	else if (line.startsWith('>') && line.charAt(1) != ">") {
		parseVars.dialogNum++;
		parseVars.dialogOn = true;
		
		parseVars.dialog.name = titleCase(line.substr(1)).trim();
		parseVars.dialog.text = ""
		//parseVars.dialog.name = toProperCase(line.substr(1)).trim();
		//parseVars.pageJson.lines.push({ type: 'char', text: line.substr(1).trim() })
	} 
	
	// else if (line.startsWith('>>') && line.charAt(2) != ">") {
	// 	parseVars.pageJson.lines.push({ type: 'paren', text: "[No Dialog]" })
	// } 


	// Character Dialog
	else if (parseVars.dialogOn) {
		if (line.length === 0) {
			parseVars.pageJson.lines.push({ type: 'dialog', 
				name: parseVars.dialog.name, 
				text: parseVars.dialog.text.trim(), 
				number: parseVars.dialogNum 
			})

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

		// if (line.startsWith('(')) {
		// 	parseVars.dialogNum++;
		// 	parseVars.pageJson.lines.push({ type: 'paren', text: line })
		// } else { 
		// 	parseVars.pageJson.lines.push({ type: 'dialog', text: line, number: parseVars.dialogNum })
		// }
	} 


	else if (line.startsWith('>>') && line.charAt(2) != ">") {
		parseVars.pageJson.lines.push({ type: 'letnote', text: line.substr(2) })
	} 

	else if (line.startsWith('<<') && line.charAt(2) != "<") {
		parseVars.pageJson.lines.push({ type: 'comment', text: line.substr(2) })
	} 
	

	// Default
	else {
		if (line && line.length>0)
			//conv.converter.StandardLine(line);
			parseVars.pageJson.lines.push({ type: 'desc', text: line })
		}

}

var writeMeta = function(conv, meta) {
	if (meta.title) {
		conv.Title(meta.title);
	}
	if (meta.issueNo) {
		conv.IssueNumber(meta.issueNo);
	}
	if (meta.issueTitle) {
		conv.IssueTitle(meta.issueTitle);
	}
	if (meta.credit) {
		conv.Credit(meta.credit);
	}
	if (meta.story) {
		conv.Story(meta.story);
	}
	if (meta.writer) {
		conv.Writer(meta.writer);
	}
	if (meta.author) {
		conv.Author(meta.author);
	}
	if (meta.letterer) {
		conv.Letterer(meta.letterer);
	}
	if (meta.artist) {
		conv.Artist(meta.artist);
	}
	if (meta.pencils) {
		conv.Pencils(meta.pencils);
	}
	if (meta.ink) {
		conv.Ink(meta.ink);
	}
	if (meta.color) {
		conv.Color(meta.color);
	}
	if (meta.description) {
		conv.Description(meta.description);
	}
	if (meta.draft) {
		conv.DraftInfo(meta.draft);
	}
	if (meta.contact) {
		conv.Contact(meta.contact);
	}

}
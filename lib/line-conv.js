
var parseVars = {
	meta: {},
	commentOn: false,
	dialogOn: false,
	pageNum: 0,
	panelNum: 0,
	dialogNum: 0,
	pageJson: null
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

		previousLine = line;
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
						if (mode != 'a') conv.converter.Dialog(element.text, element.number);
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
		//conv.converter.PanelHeading("", parseVars.panelNum);
		parseVars.pageJson.lines.push({ type: 'panel', number: parseVars.panelNum })
	}

	// Title Page
	else if (parseVars.pageNum === 0) {
		var lineUpper = line.toUpperCase();
		if (lineUpper.startsWith('TITLE:')) {
			parseVars.meta.title = line.substr(6)
		}
		if (lineUpper.startsWith('ISSUE:')) {
			parseVars.meta.issueNo = line.substr(6)
		}
		if (lineUpper.startsWith('ISSUE TITLE:')) {
			parseVars.meta.issueTitle = line.substr(12)
		}
		if (lineUpper.startsWith('CREDIT:')) {
			parseVars.meta.credit = line.substr(7)
		}
		if (lineUpper.startsWith('AUTHOR:')) {
			parseVars.meta.author = line.substr(7)
		}
		if (lineUpper.startsWith('DRAFT DATE:')) {
			parseVars.meta.draft = line.substr(11)
		}
		if (lineUpper.startsWith('CONTACT:')) {
			parseVars.meta.contact = line.substr(8)
		}
		if (lineUpper.startsWith('SCRIPT DESCRIPTION:')) {
			parseVars.meta.description = line.substr(19)
		}
	}

	
	// Test for start of character dialog
	else if (line.startsWith('>') && line.charAt(1) != ">") {
		parseVars.dialogNum++;
		parseVars.dialogOn = true;
		//conv.converter.CharacterName(line.substr(1));
		parseVars.pageJson.lines.push({ type: 'char', text: line.substr(1).trim() })
	} 
	


	// Character Dialog
	else if (parseVars.dialogOn) {
		if (line.length === 0) {
			parseVars.dialogOn = false;
			conv.converter.BlankLine();
			previousLine = line;
			return;
		}

		if (line.startsWith('(')) {
			parseVars.dialogNum++;
			//conv.converter.DialogParenthetical(line);
			parseVars.pageJson.lines.push({ type: 'paren', text: line })
		} else { 
			//conv.converter.Dialog(line, parseVars.dialogNum);
			parseVars.pageJson.lines.push({ type: 'dialog', text: line, number: parseVars.dialogNum })
		}
	} 


	else if (line.startsWith('>>') && line.charAt(2) != ">") {
		//conv.converter.LetteringNote(line.substr(2));
		parseVars.pageJson.lines.push({ type: 'letnote', text: line.substr(2) })
	} 

	else if (line.startsWith('<<') && line.charAt(2) != "<") {
		//conv.converter.Comment(line.substr(2));
		parseVars.pageJson.lines.push({ type: 'comment', text: line.substr(2) })
	} 
	

	// Default
	else {
		if (line && line.length>0)
			//conv.converter.StandardLine(line);
			parseVars.pageJson.lines.push({ type: 'desc', text: line })
		}

	previousLine = line;

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
	if (meta.author) {
		conv.Author(meta.author);
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
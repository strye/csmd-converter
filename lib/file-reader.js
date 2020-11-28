const matter = require('gray-matter');

class FileReader {
    static titleCase = function(str) {
        return str.toLowerCase().split(' ').map(function(word) {
            if (word.startsWith("(") | word.endsWith(")")) {
                return word.toUpperCase()
            }
            //return word.replace(word[0], word[0].toUpperCase());
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }
    
	constructor(options = {}) {
		this._cleanContent = options.cleanContent || true;
	}

	read(file) {
		let self = this,
		fileLines = [],
		parseVars = {
			preScript: true,
			commentOn: false,
			dialogOn: false,
			dialog: {},
			lineNo: 0
		};
			

		return new Promise(function (resolve, reject){
			let doc = matter.read(file);

			// read file line by line
			doc.content.split('\n').forEach(line => {
			let res = self.parseLine(line.trim(), parseVars);
			if (res) {
				parseVars.lineNo++;
				res.order = parseVars.lineNo;
				fileLines.push(res);
			}
			});

			let fileRes = self.prepContent(fileLines);
			fileRes.data = doc.data;
			return resolve(fileRes);

		});
    }
    
	parseLine(line, parseVars) {
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
	
		// Test for start of character dialog
		else if (line.startsWith('@')) {
			parseVars.dialogOn = true;
			
			parseVars.dialog.name = FileReader.titleCase(line.substr(1)).trim();
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
			res = { type: 'artnote', text: line.substr(2) }
		} 
		
		// Default
		else if (line && line.length>0) {
			res = { type: 'desc', text: line }
		}
	
		return res;
	}
	
	prepContent(fileLines) {
		let panelCnt = 0, dialogCnt = 0, pageCnt = 0, page = null;
		let script = [];
		

		fileLines.forEach(line => {
			if (line.type === "page") {
				if (page) {
					page.panels = panelCnt;
					panelCnt = 0;
					dialogCnt = 0;
				}

				pageCnt++;
				page = line;
				page.number = pageCnt
			}
			if (line.type === "panel") {
				panelCnt++;
				line.number = panelCnt;
			}

			if (line.type === "dialog") {
				dialogCnt++;
				line.number = dialogCnt;
			}

			script.push(line);
		});
		if (page) {
			page.panels = panelCnt;
		}
		return { script: script, pageCount: pageCnt };
	}
}

module.exports = FileReader

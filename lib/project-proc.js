

// Project Converter Steps
// - Read meta file
// - Setup PDF or Docx file reference
// - Create Title Page
// - Iterate over the pages
//   + Write each page

exports = module.exports = function ConvertProject(scriptFolder, options)
{
	let self = this, 
		meta = require(scriptFolder + "/issue_meta.json"),
		conv = setupOutput(options, scriptFolder),
		mode = options.mode || "s";
		// The special purpose of the file.
		//    s=script (default)
		//    a=artist
		//    l=letterer
		//    f=full (With personal comments)


	writeMeta(conv, meta);

	if (options.characters) {}
	if (options.locations) {}

	let pageNumber = 0;
	meta.pages.forEach(page => {
		pageNumber++;
		var lineParse = require("./line-parse");

		// Load file into page structure
		let pageLines = [];
		let parseVars = {
			commentOn: false,
			dialogOn: false,
			dialog: {}
		};

		// read file line by line
		var lineReader = require('readline').createInterface({
			input: require('fs').createReadStream(page.filePath)
		});

		lineReader.on('line', function (line) {
			parseVars.lineNo++;
			let res = lineParse(line.trim(), parseVars);
			if (res) {
				res.order = parseVars.lineNo;
				pageLines.push(res);
			}
		});

		lineReader.on('close', function () {
			//conv.converter.Cleanup();
			let panelCnt = 0, dialogCnt = 0;
			pageLines.forEach(line => {
				if (line.type === "panel") {
					panelCnt++;
					line.number = panelCnt;
				}

				if (line.type === "dialog") {
					dialogCnt++;
					line.number = dialogCnt;
				}
			});

			writePage(conv, mode, pageNumber, panelCnt, pageLines);
		});

	});

}


var writePage = function(conv, mode, pageNumber, panelCnt, pageLines) { 

	conv.converter.PageHeading("", pageNumber, panelCnt);

	pageLines.forEach(element => {
		switch (element.type) {
			case "panel":
				conv.converter.PanelHeading("", element.number);
				break;
			case "char":
				if (mode != 'a') conv.converter.CharacterName(element.text);
				break;
			case "dialog":
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

}


var setupOutput = function(options, scriptFolder) { 
	
	// The format to convert to
	let type = options.type || "pdf";

	// The file name and path to output to
	let outputFile = options.outputFile || scriptFolder + "." + type;

	// The file creator. Name used for file metadata.
	let creator = meta.creator || meta.writer || "Anonymous";
	
	var conv = new convFactory({type: type, outputFile: outputFile, creator: creator});
	conv.converter.Setup();

	return conv;
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
	if (meta.description) {
		conv.Description(meta.description);
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
	if (meta.draft) {
		conv.DraftInfo(meta.draft);
	}
	if (meta.version) {
		conv.DraftInfo(meta.version);
	}
	if (meta.contact) {
		conv.Contact(meta.contact);
	}

}


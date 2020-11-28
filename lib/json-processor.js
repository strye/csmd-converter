#!/usr/bin/env node

class JsonProcessor {
	static converterFactory(type = "cli", options = {}) {
		let converter = null;

		switch(type.toLowerCase()) {
			case "pdf": 	converter = require("./cnvrtr-pdf"); break;
			case "docx":	converter = require("./cnvrtr-docx"); break;
			case "html": 	converter = require("./cnvrtr-html"); break;
			case "txt": 	converter = require("./cnvrtr-text"); break;
			default: 		converter = require("./cnvrtr-console");
		}
	
		return new converter(options);
	}

	constructor(options = {}) {
		// The format to convert to
		this._type = options.type || "pdf";

		// The file name and path to output to
		this._outputFile = options.outputFile || "script.pdf";

		// The special purpose of the file. 
		//    s=script (default)
		//    a=artist
		//    l=letterer
		//    f=full (With personal comments)
		this._mode = options.mode || "s";

		// The file creator. Name used for file metadata.
		this._creator = options.creator || "Anonymous";
	}

	process(script) {
		let self=this;

		return new Promise(function (resolve, reject){

			const outputOptions = {type: self._type, outputFile: self._outputFile, creator: self._creator, mode: self._mode};
			let conv = JsonProcessor.converterFactory(self._type, outputOptions);
			//console.log(conv);
			conv.Setup();

			self.writeMeta(conv, script.data)

			script.script.forEach(element => {
				self.writeLine(conv, element, self._mode);
			});

			conv.Cleanup();

			return resolve(outputOptions);
		})

	}

	writeMeta = function(conv, meta) {
		if (meta.Title) { conv.Title(`Title: ${meta.Title}`); }
		if (meta.IssueNumber) { conv.IssueNumber(`Isssue Num: ${meta.IssueNumber}`); }
		if (meta.IssueTitle) { conv.IssueTitle(`Issue Title: ${meta.IssueTitle}`); }
		if (meta.Description) { conv.Description(`Description: ${meta.Description}`); }
		if (meta.Credit) { conv.Credit(`Special Credit: ${meta.Credit}`); }
		if (meta.Story) { conv.Story(`Story By: ${meta.Story}`); }
		if (meta.Writer) { conv.Writer(`Written By: ${meta.Writer}`); }
		if (meta.Artist) { conv.Artist(`Artist: ${meta.Artist}`); }
		if (meta.Letterer) { conv.Letterer(`Letterer: ${meta.Letterer}`); }
		if (meta.Color) { conv.Color(`Colorist: ${meta.Color}`); }
		if (meta.Pencils) { conv.Pencils(`Pencils: ${meta.Pencils}`); }
		if (meta.Ink) { conv.Ink(`Inks: ${meta.Ink}`); }
		if (meta.Version) { conv.Version(`Script Version: ${meta.Version}`); }
		if (meta.DraftDate) { conv.DraftDate(`Draft Date: ${meta.DraftDate}`); }
		if (meta.DraftInfo) { conv.DraftInfo(`Draft Notes: ${meta.DraftInfo}`); }
		if (meta.Contact) { conv.Contact(`Contact Information: ${meta.Contact}`); }
	}

	writeLine = function(conv, line, mode) {
		line.text = line.text.trim();
		switch (line.type) {
			case "page":
				conv.PageHeading("", line.number, line.panels);
				break;
			case "panel":
				conv.PanelHeading("", line.number);
				break;
			case "dialog":
				if (mode != 'a') conv.GeneralDialog(line.number, line.name, line.text);
				break;
			case "paren":
				if (mode != 'a') conv.DialogParenthetical(line.text);
				break;
			case "letnote":
				if (mode != 'a') conv.LetteringNote(line.text);
				break;
			case "artnote":
				if (mode != 'l') conv.ArtistNote(line.text);
				break;
			case "private":
				if (mode === 'f') conv.PrivateNote(line.text);
				break;
			default:
				if (mode != 'l') conv.StandardLine(line.text);
				break;
		}				
	
	}
	
	
}

module.exports = JsonProcessor

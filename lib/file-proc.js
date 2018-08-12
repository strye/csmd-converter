#!/usr/bin/env node
let Promise = require("bluebird"),
	convFactory = require("./converter-factory");


exports = module.exports = function(script, options) {

	// The format to convert to
	let type = options.type || "pdf";

	// The file name and path to output to
	let outputFile = options.outputFile || "script.pdf";

	// The special purpose of the file. 
	//    s=script (default)
	//    a=artist
	//    l=letterer
	//    f=full (With personal comments)
	let mode = options.mode || "s";

	// The file creator. Name used for file metadata.
	let creator = options.creator || "Anonymous";
	

	return new Promise(function (resolve, reject){

		const outputOptions = {type: type, outputFile: outputFile, creator: creator, mode: mode};
		var conv = new convFactory(outputOptions);
		conv.converter.Setup();

		writeMeta(conv.converter, script.meta)

		script.script.forEach(element => {
			writeLine(conv.converter,element, mode);
		});

		conv.converter.Cleanup();

		return resolve(outputOptions);
	})
}


const writeLine = function(conv, line, mode) {
	line.text = line.text.trim();
	switch (line.type) {
		case "page":
			conv.PageHeading("", line.number, line.panels);
			break;
		case "panel":
			conv.PanelHeading("", line.number);
			break;
		case "char":
			if (mode != 'a') conv.CharacterName(line.text);
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
		case "comment":
			if (mode != 'l') conv.Comment(line.text);
			break;
		case "private":
			if (mode === 'f') conv.PrivateNote(line.text);
			break;
		default:
			if (mode != 'l') conv.StandardLine(line.text);
			break;
	}				

}

const writeMeta = function(conv, meta) {
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


#!/usr/bin/env node
let Promise = require("bluebird"),
	lineParse = require("./line-parse");

exports = module.exports = function(file) {
	let fileResults = {
		meta: {},
		script: []
	}
	let fileLines = [];
	let parseVars = {
		preScript: true,
		commentOn: false,
		dialogOn: false,
		dialog: {},
		lineNo: 0
	};

	return new Promise(function (resolve, reject){

		// read file line by line
		var lineReader = require('readline').createInterface({
			input: require('fs').createReadStream(file)
		});

		lineReader.on('line', function (line) {
			let res = lineParse(line.trim(), parseVars);
			if (res) {
				parseVars.lineNo++;
				res.order = parseVars.lineNo;
				fileLines.push(res);
			}
		});

		lineReader.on('close', function () {
			let panelCnt = 0, dialogCnt = 0, pageCnt = 0;
			let page = null;
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

				if (line.type === "meta") {
					fileResults.meta[line.attr] = line.text;
				} else {
					fileResults.script.push(line);
				}
			});
			if (page) {
				page.panels = panelCnt;
			}

			return resolve(fileResults);
		});

	});

}


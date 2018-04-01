var cliConv = require("./lib/console-conv"),
	htmlConv = require("./lib/html-conv"),
	pdfConv = require("./lib/pdf-conv"),
	comxpConv = require("./lib/comxp-pdf"),
	comxpDocxConv = require("./lib/comxp-docx"),
	txtConv = require("./lib/text-conv"),
	getMdMeta = require("./lib/get-md-meta"),
	lineConv = require("./lib/line-conv"),
	docxTest = require("./lib/docx-test");


module.exports.GetMdMeta = getMdMeta;


module.exports.LineConverter = lineConv;


module.exports.ConverterFactory = function(options) {
	var self = this;
	self.type = options.type || "";
	self.outputFile = options.outputFile || "";

	self.converter;

	self.loadConverter = function() {
		switch(self.type.toLowerCase()) {
			case "rtf":
				break;
			case "html":
				self.converter = new htmlConv(options);
				break;
			case "pdf":
				self.converter = new pdfConv(options);
				break;
			case "comxpp":
				self.converter = new comxpConv(options);
				break;
			case "comxpd":
				self.converter = new comxpDocxConv(options);
				break;
			case "cli":
				self.converter = new cliConv(options);
				break;
			case "txt":
				self.converter = new txtConv(options);
				break;
			case "docxt":
				self.converter = new docxTest(options);
				break;
			default:
				self.type = "cli";
				self.converter = new cliConv(options);
		}
	}

	if (self.type.length > 0) self.loadConverter();
}

var cliConv = require("./console-conv"),
	htmlConv = require("./html-conv"),
	pdfConv = require("./pdf-conv"),
	comxpConv = require("./comxp-pdf"),
	comxpDocxConv = require("./comxp-docx"),
	txtConv = require("./text-conv"),
	docxTest = require("./docx-test");


exports = module.exports = function(options) {
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
	
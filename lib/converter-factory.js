var cliConv = require("./console-conv"),
	htmlConv = require("./html-conv"),
	pdfConv = require("./pdf-conv"),
	docxConv = require("./docx-conv"),
	txtConv = require("./text-conv"),
	docxTest = require("./docx-test");


exports = module.exports = function(options) {
	var self = this;
	self.type = options.type || "";
	self.outputFile = options.outputFile || "";

	self.converter;

	self.loadConverter = function() {
		switch(self.type.toLowerCase()) {
			case "pdf":
				self.converter = new pdfConv(options);
				break;
			case "docx":
				self.converter = new docxConv(options);
				break;
			// case "rtf":
			//  To be implemented
			// 	break;
			case "html":
				self.converter = new htmlConv(options);
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
	
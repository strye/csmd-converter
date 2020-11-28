const CSMDConverter = require("../index.js"); 


var options = {
	type: 'cli', 
	//outputFile: './sample.html',
	mode: 'f', 
	creator: 'Bob Dobbs'
}

//console.log(options)
CSMDConverter.Processor('./script.csmd', options)

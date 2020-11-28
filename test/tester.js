const CSMDConverter = require("../index.js"); 


let runner = {
	runSync() {
		// Runs each converter sequentially
		const optionSets = {
			docx: { type: 'docx', outputFile: './samples/sample.docx', mode: 'f', creator: 'Bob Dobbs' },
			pdf: { type: 'pdf', outputFile: './samples/sample.pdf', mode: 'f', creator: 'Bob Dobbs' },
			txt: { type: 'txt', outputFile: './samples/sample.txt', mode: 'f', creator: 'Bob Dobbs' },
			html: { type: 'html', outputFile: './samples/sample.html', mode: 'f', creator: 'Bob Dobbs' },
			cli: { type: 'cli', mode: 'f', creator: 'Bob Dobbs' }
		}

		CSMDConverter.Processor('./script.csmd', optionSets.docx)
		.then(function(opts){
			console.log(opts.outputFile + ' written')
			return CSMDConverter.Processor('./script.csmd', optionSets.pdf)
		})
		.then(function(opts){
			console.log(opts.outputFile + ' written')
			return CSMDConverter.Processor('./script.csmd', optionSets.txt)
		})
		.then(function(opts){
			console.log(opts.outputFile + ' written')
			return CSMDConverter.Processor('./script.csmd', optionSets.html)
		})
		.then(function(opts){
			console.log(opts.outputFile + ' written')
			return CSMDConverter.Processor('./script.csmd', optionSets.cli)
		})
	},
	runAsync() {
		// Runs all in parallel
		const optionSets = [
			{ type: 'docx', outputFile: './samples/sample.docx', mode: 'f', creator: 'Bob Dobbs' },
			{ type: 'pdf', outputFile: './samples/sample.pdf', mode: 'f', creator: 'Bob Dobbs' },
			{ type: 'txt', outputFile: './samples/sample.txt', mode: 'f', creator: 'Bob Dobbs' },
			{ type: 'html', outputFile: './samples/sample.html', mode: 'f', creator: 'Bob Dobbs' },
			{ type: 'cli', mode: 'f', creator: 'Bob Dobbs' }
		]
		
		optionSets.forEach(options => {
			CSMDConverter.Processor('./script.csmd', options)
			.then(function(opts){ console.log(opts.outputFile + ' written') });
		});
	}
}


runner.runSync();


const ConverterBase = require("./cnvrtr-base"),
chalk = require('chalk');


class ConsoleConverter extends ConverterBase { 
	constructor(options = {}) {
		super('txt', options);
	}

	writeLine(line, type='') {
		switch (type) {
			case 'meta': 		console.log(`${"~".repeat(4)} ${chalk.bgWhite.blue(line)}`); break;
			case 'page': 		console.log(chalk.bold.yellow(line)); break;
			case 'panel': 		console.log(chalk.underline.cyan(line)); break;
			case 'pvt-note': 	console.log(chalk.bgBlack.red(line)); break;
			case 'art-note': 	console.log(chalk.bgBlack.green(line)); break;
			case 'ltr-note': 	console.log(" ".repeat(10) + chalk.bgBlack.blue(line)); break;
			case 'note': 		console.log(chalk.bgYellow.red(line)); break;
			case 'note': 		console.log(chalk.bgYellow.red(line)); break;
			default:			console.log(line); break;
		}

	}

	GeneralDialog(dNum, name, dialog) {
		console.log(`${" ".repeat(10) + dNum} ) ${chalk.inverse.underline(name.toUpperCase())}:${" ".repeat(5)}${dialog}`);
	}
}

module.exports = ConsoleConverter


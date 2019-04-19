export default {
	fetch: process.platform === 'win32' && (async () => (await appcd.call('/windows/1.x/info')).response),
	render(console, info) {
		const chalk = require('chalk');
		const { bold, cyan, gray, magenta } = chalk;

		console.log('Windows');
		console.log(info);
		console.log();
	}
};

export default {
	fetch: process.platform === 'win32' && (async () => (await appcd.call('/windows/1.x/info')).response),
	render(console, info) {
		const { bold, cyan, gray, magenta } = require('chalk');

		console.log('Windows');
		console.log(info);
		console.log();
	}
};

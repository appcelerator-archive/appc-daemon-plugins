export default {
	fetch: process.platform === 'win32' && (async () => (await appcd.call('/windows/1.x/info')).response),
	render(console, info) {
		const { bold, cyan, gray, magenta } = require('chalk');

		console.log(bold('Microsoft® Visual Studio'));

		if (info.visualstudio && Object.keys(info.visualstudio).length) {
			for (const ver of Object.keys(info.visualstudio).sort()) {
				const vs = info.visualstudio[ver];
				console.log(`  ${cyan(ver)}${vs.selected ? gray(' (selected)') : ''}`);
				console.log(`    Path                = ${magenta(vs.path)}`);
				console.log(`    CLR Version         = ${magenta(vs.clrVersion)}`);
				console.log(`    MSBuild Version     = ${magenta(`v${vs.msbuildVersion}`)}`);
			}
		} else {
			console.log(gray('  None'));
		}
		console.log();
	}
};

export default {
	async action({ console, argv }) {
		console.log(argv);
		const { response } = await appcd.call('/sdk/uninstall', { data: { uri: argv.version } });
		console.log(response);
	},
	args: [
		{
			name: 'version',
			desc: 'The version to uninstall',
			required: true
		}
	],
	desc: 'Remove a specific Titanium SDK version.'
};

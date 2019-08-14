export default {
	async action({ console, argv }) {
		const { response } = await appcd.call('/sdk/install', {
			data: {
				keep:      argv.keep,
				overwrite: argv.force,
				uri:       argv.version || 'latest'
			}
		});
		console.log(response);
	},
	args: [
		{
			name: 'version',
			desc: 'The version to install, "latest", URL, or zip file'
		}
	],
	desc: 'Download the latest Titanium SDK or a specific version.',
	options: {
		'-b, --branch <name>': 'The branch to install from or "latest" (stable)',
		'-f, --force': 'Force re-install',
		'-k, --keep': {
			aliases: '!--keep-files',
			desc: 'Keep downloaded files after install'
		}
	}
};

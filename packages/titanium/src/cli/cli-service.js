import Dispatcher from 'appcd-dispatcher';

/**
 * Defines a service endpoint for defining, processing, and dispatching Titanium CLI commands.
 */
export default class CLIService extends Dispatcher {
	/**
	 * Registers all of the endpoints.
	 *
	 * @param {Object} cfg - The Appc Daemon config object.
	 * @returns {Promise}
	 * @access public
	 */
	async activate(cfg) {
		this.config = cfg;

		this.register('/', ctx => {
			// const { argv } = ctx.request.data;
			return 'IT WORKS!!!!';
		});

		this.register('/schema', () => {
			return {
				schemas: 'rock'
			};
		});
	}

	/**
	 * ?
	 *
	 * @returns {Promise}
	 * @access public
	 */
	async deactivate() {
		//
	}
}

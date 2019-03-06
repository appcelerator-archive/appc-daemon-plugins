import Dispatcher from 'appcd-dispatcher';
import fs from 'fs-extra';
import SDKListInstalledService from './sdk-list-installed-service';
import Response, { AppcdError, codes } from 'appcd-response';

import { expandPath } from 'appcd-path';
import { get } from 'appcd-util';
import { isFile } from 'appcd-fs';
import { getInstallPaths, options, sdk } from 'titaniumlib';

/**
 * Defines a service endpoint for listing, installing, and uninstalling Titanium SDKs.
 */
export default class SDKService extends Dispatcher {
	/**
	 * Registers all of the endpoints and initializes the installed SDKs detect engine.
	 *
	 * @param {Object} cfg - The Appc Daemon config object.
	 * @returns {Promise}
	 * @access public
	 */
	async activate(cfg) {
		this.config = cfg;

		// set titaniumlib's network settings
		const { APPCD_NETWORK_CA_FILE, APPCD_NETWORK_PROXY, APPCD_NETWORK_STRICT_SSL } = process.env;
		const { network } = options;
		Object.assign(network, cfg.network);
		if (APPCD_NETWORK_CA_FILE && isFile(APPCD_NETWORK_CA_FILE)) {
			network.ca = fs.readFileSync(APPCD_NETWORK_CA_FILE).toString();
		}
		if (APPCD_NETWORK_PROXY) {
			network.proxy = APPCD_NETWORK_PROXY;
		}
		if (APPCD_NETWORK_STRICT_SSL !== undefined && APPCD_NETWORK_STRICT_SSL !== 'false') {
			network.strictSSL = true;
		}

		this.installed = new SDKListInstalledService();
		await this.installed.activate(cfg);

		this.register([ '/', '/list' ], (ctx, next) => {
			ctx.path = '/list/installed';
			return next();
		})
			.register('/list/installed',          this.installed)
			.register('/list/ci-branches',        () => sdk.getBranches())
			.register('/list/ci-builds/:branch?', ctx => sdk.getBuilds(ctx.request.params.branch))
			.register('/list/locations',          () => getInstallPaths(get(this.config, 'titanium.sdk.defaultInstallLocation')))
			.register('/list/releases',           () => sdk.getReleases())
			.register('/install/:name?',          ctx => this.install(ctx))
			.register('/uninstall/:name?',        ctx => this.uninstall(ctx));
	}

	/**
	 * Shuts down the installed SDKs detect engine.
	 *
	 * @returns {Promise}
	 * @access public
	 */
	async deactivate() {
		await this.installed.deactivate();
	}

	/**
	 * Install SDK service handler.
	 *
	 * @param {Context} ctx - A request context.
	 * @returns {Promise}
	 * @access private
	 */
	async install(ctx) {
		const { data, params } = ctx.request;

		await sdk.install({
			downloadDir: this.config.home && expandPath(this.config.home, 'downloads'),
			keep:        data.keep,
			overwrite:   data.overwrite,
			uri:         data.uri || params.name
		});

		ctx.response = new Response(codes.OK, 'Installed successfully');
	}

	/**
	 * Deletes an installed Titanium SDK by name or path.
	 *
	 * @param {Context} ctx - A dispatcher context.
	 * @returns {Promise<Object>}
	 * @access private
	 */
	async uninstall(ctx) {
		const { data, params } = ctx.request;
		const uri              = (data.uri || params.name || '').trim();

		if (!uri) {
			throw new AppcdError(codes.BAD_REQUEST, 'Missing Titanium SDK name or path');
		}

		try {
			return await sdk.uninstall({ uri });
		} catch (e) {
			if (e.code === 'ENOTFOUND') {
				throw new AppcdError(codes.NOT_FOUND, e);
			} else {
				throw e;
			}
		}
	}
}

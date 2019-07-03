import DetectEngine from 'appcd-detect';
import gawk from 'gawk';
import version from './version';

import * as windowslib from 'windowslib';

import { DataServiceDispatcher } from 'appcd-dispatcher';
import { arrayify, get, mergeDeep } from 'appcd-util';

/**
 * The Windows info service.
 */
export default class WindowsInfoService extends DataServiceDispatcher {

	/**
	 * Initializes the timers for polling Windows information.
	 *
	 * @param {Config} cfg - An Appc Daemon config object.
	 * @returns {Promise}
	 * @access public
	 */
	async activate(cfg) {
		this.config = cfg;
		if (cfg.windows) {
			mergeDeep(windowslib.options, cfg.windows);
		}

		this.data = gawk({
			sdks: {},
			visualstudio: {}
		});

		/**
		 * A map of buckets to a list of active fs watch subscription ids.
		 * @type {Object}
		 */
		this.subscriptions = {};

		/**
		 * ?
		 */
		// this.winregWatchHandles = {};

		await Promise.all([
			this.initSDKs() // ,
			// this.initVisualStudios()
		]);
	}

	/**
	 * Shutsdown the Windows info service.
	 *
	 * @returns {Promise}
	 * @access public
	 */
	async deactivate() {
		// for (const handle of Object.values(this.winregWatchHandles)) {
		// 	handle.stop();
		// }

		if (this.sdkDetectEngine) {
			await this.sdkDetectEngine.stop();
			this.sdkDetectEngine = null;
		}
	}

	/**
	 * Detect Windows SDKs.
	 *
	 * @returns {Promise}
	 * @access private
	 */
	async initSDKs() {
		const paths = [
			...arrayify(get(this.config, 'windows.sdk.searchPaths'), true),
			windowslib.sdk.defaultPath
		];

		this.sdkDetectEngine = new DetectEngine({
			checkDir(dir) {
				try {
					return windowslib.sdk.detectSDKs(dir);
				} catch (e) {
					// 'dir' is not an SDK
				}
			},
			depth:               1,
			multiple:            true,
			name:                'windows:sdk',
			paths,
			recursive:           true,
			recursiveWatchDepth: 3,
			redetect:            true,
			// registryKeys:        windowslib.sdk.registryKeys.map(key => ({
			// 	key: new RegExp(key + )
			// })),
			watch:               true
		});

		// listen for sdk results
		this.sdkDetectEngine.on('results', results => {
			const sdks = {};
			for (const sdk of results.sort((a, b) => version.compare(a.version, b.version))) {
				sdks[sdk.version] = sdk;
			}
			gawk.set(this.data.sdks, sdks);
		});

		await this.sdkDetectEngine.start();
	}

	/**
	 * Detect Visual Studio installations.
	 *
	 * @returns {Promise}
	 * @access private
	 * /
	initVisualStudios() {
		//
	}
	*/
}

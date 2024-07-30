import type { SearchParamOptions } from "$types/catch-all";
import { boolFlag } from "$src/featureFlags";

import type { Config } from "$types/config";

declare const self: WorkerGlobalScope &
	typeof globalThis & {
		config: Config;
	};

const escapeKeyword = "_";

self.config = {
	prefix: "/go/",
	pathToInitialSW: "/sw.js",
	bundles: {
		config: "/aero/config.aero.js",
		sandbox: "/aero/sandbox/sandbox.aero.js"
	},
	aeroPathFilter: path =>
		Object.values(self.config.bundles).find(bundlePath =>
			path.startsWith(bundlePath)
		) === null ||
		path.startsWith("/tests/") ||
		path.startsWith("/baremux") ||
		path.startsWith("/epoxy/") ||
		!path.startsWith(self.config.prefix),
	searchParamOptions: {
		referrerPolicy: {
			escapeKeyword,
			/* This is the real (original) rewriter policy before it was forced to be unsafe-url */
			searchParam: "passthroughReferrerPolicy"
		},
		isModule: {
			escapeKeyword,
			/* This is the real (original) rewriter policy before it was forced to be unsafe-url */
			searchParam: "isModule"
		}
	},
	cacheKey: "httpCache",
	dynamicConfig: {
		dbName: "aero",
		id: "update"
	},
	urlEncoder: url => url,
	urlDecoder: url => url,
	featureFlags: {
		FEATURE_URL_ENC: boolFlag(false),
		FEATURE_CORS_TESTING: boolFlag(false),
		FEATURE_CORS_EMULATION: boolFlag(false),
		FEATURE_INTEGRITY_EMULATION: boolFlag(false),
		FEATURE_ENC_BODY_EMULATION: boolFlag(false),
		FEATURE_CACHES_EMULATION: boolFlag(false),
		FEATURE_CLEAR_EMULATION: boolFlag(false),
		REWRITER_HTML: boolFlag(true),
		REWRITER_XSLT: boolFlag(false),
		REWRITER_JS: boolFlag(false),
		REWRITER_CACHE_MANIFEST: boolFlag(false),
		SUPPORT_LEGACY: boolFlag(false),
		SUPPORT_WORKER: boolFlag(false),
		DEBUG: boolFlag(false)
	}
};

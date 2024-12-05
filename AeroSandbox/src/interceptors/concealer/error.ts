import { type APIInterceptor, SupportEnum } from "$types/apiInterceptors.d.ts";

import { afterPrefix } from "$util/getProxyURL";

/*
Error emulation
These properties are not standard, so functionality is different in browsers
These interceptors will probably change a lot over time
*/
export default {
	proxifiedHandlers: {
		construct(target, args) {
			const res = Reflect.construct(target, args);

			// Firefox exclusives
			// Error location
			if (typeof res.columnNumber !== "undefined")
				// TODO: Get the column number of the unscoped file
				// Possibly, add a data attribute with the original script
				res.columnNumber = "";
			if (typeof res.fileName !== "undefined")
				res.fileName = afterPrefix(res.fileName);

			// Implemented in most major browsers
			if (typeof res.stack !== "undefined")
				if (navigator.userAgent.includes("Firefox")) {
					const match = /Firefox\/([\d\.]+)/g.exec(
						navigator.userAgent
					);

					if (match !== null && match.length === 2) {
						const ver = Number.parseFloat(match[1]);

						res.stack = res.stack.replace(
							new RegExp(
								`^(@)(.+)(\\d+${ver >= 30 ? ":\\d+" : ""})$`,
								"g"
							),
							(_match, g1, g2, g3) => g1 + afterPrefix(g2) + g3
						);
					}
				} else if (navigator.userAgent.includes("Chrome"))
					res.stack = res.stack
						.split("\n")
						.map(line =>
							// Basically does the same thing as `afterPrefix`, but with multiple possible matches
							line.replace(new RegExp(location.origin + $aero.config.prefix), ""),
						)
						.join("\n")
						// TODO: Move these RegExps globally in this file
						.replace(
							/^(at )([A-Za-z\.]+ )?.+(?=:\d+:\d+)/g,
							(_match, g1, g2, g3) => g1 + g2 + afterPrefix(g3)
						)
						.replace(
							/(?<=\().+(?=:\d+:\d+\))/g,
							(_match, g1, g2) => g1 + afterPrefix(g2)
						);
			// TODO: Support Safari

			return res;
		}
	},
	globalProp: "Error",
	conceals: [{
		what: "Error.stack",
		revealerType: {
			type: "url",
			reveals: "escapedUrl"
		},
	}, {
		what: "Error.fileName",
		revealerType: {
			type: "url",
			reveals: "escapedUrl"
		}
	}],
	supports: SupportEnum.nonStandard
} as APIInterceptor;

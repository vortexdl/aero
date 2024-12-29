/**
 * @module
 * This module contains functions to get the URL of the client through various means.
 * This is a helper module for `./getClientURLAeroWrapper.ts`. I recommend using it unless you want to make your own implementation with your own SW proxy's global scope involved.
 */

// Neverthrow
import type { ResultAsync } from "neverthrow";
import { okAsync, errAsync as nErrAsync } from "neverthrow";

// Utility
import { afterPrefix } from "$util/getProxyURL";
import appendSearchParam from "$shared/escaping/appendSearchParam";

import type { rewrittenParamsOriginalsType } from "$types/commonPassthrough"

type Passthrough = Readonly<{
	params: URLSearchParams,
	referrerPolicyParamName: string,
	referrerPolicy: string,
	/** This is mainly intended so that `appendSearchParam()` can help the response header rewriter with `No-Vary-Search` header rewriting later */
	rewrittenParamsOriginals: rewrittenParamsOriginalsType
}>

/**
 * Gets the URL of the client through the `Client` API in SWs
 * This client URL is used when forming the proxy URL and in various uses for emulation
 * @returns The `URL` of the client wrapped in a `ResultAsync` for better error handling from *Neverthrow*
 */
/* biome-enable no-param-reassign */
export default async function getClientUrlThroughClient(clientId: string): Promise<ResultAsync<URL, Error>> {
	/** The client that contains information for the current window */
	const client = await clients.get(clientId);
	if (client)
		// Get the url after the prefix
		return okAsync(new URL(afterPrefix(client.url)));
	return nErrAsync(new Error("Failed to get the window client required to get the client URL"));
}

/**
 * Gets the URL of the client through forcing the `referrer-policy` header and parsing that referrer URL value 
 * This client URL is used when forming the proxy URL and in various uses for emulation
 * @returns The `URL` of the client wrapped in a `ResultAsync` for better error handling from *Neverthrow*
 */
/* biome-enable no-param-reassign */
export async function getClientUrlThroughForcedReferrer(pass: Passthrough): Promise<ResultAsync<URL, Error>> {
	const {
		params,
		referrerPolicyParamName,
		referrerPolicy,
		rewrittenParamsOriginals
	} = pass;

	// Referrer policy emulation (we will force the referrer later)
	appendSearchParam(
		params,
		referrerPolicyParamName,
		referrerPolicy,
		rewrittenParamsOriginals
	);
	// TODO: Implement
	return nErrAsync(new Error("Not implemented yet"));
}
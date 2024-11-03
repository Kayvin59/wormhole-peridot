import basicTokenAbi from "../../data/abis/basicToken.json";
import { topics } from "../../data/topics.js";

const apiKey = process.env.REACT_APP_MORALIS_API_KEY;

const baseUrl = "https://deep-index.moralis.io/api/v2.2";

// ---- EVENTS ----

export async function getEvent(chain, contract, event) {
	let method = "POST";
	let url = "/" + contract + "/events";

	let topic = topics[chain.nameId][event];

	let getParams = {
		chain: chain.moralisId,
		topic: topic
	};

	let abi = basicTokenAbi.find(element => element.type === "event" && element.name === event);
	let postParams = abi;

	return request(method, url, getParams, postParams);
}

// ---- NFTS ----

export async function getNftsByWallet(chain, userAddress, tokenAddress) {
	let method = "GET";
	let url = "/" + userAddress + "/nft";

	let getParams = {
		chain: chain.moralisId,
		address: userAddress,
		token_addresses: tokenAddress
	};

	return request(method, url, getParams);
}

export async function getNftsByContract(chain, tokenAddress) {
	let method = "GET";
	let url = "/nft/" + tokenAddress;

	let getParams = {
		chain: chain.moralisId
	};

	return request(method, url, getParams);
}

// ---- REQUESTS ----

async function request(method, urlPart, getParams, postParams) {
	let url = baseUrl + urlPart;

	if (getParams !== undefined) {
		url += "?" + (new URLSearchParams(getParams));
	}

	let options = {
		method: method,
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"X-API-Key": apiKey
		},
		body: JSON.stringify(postParams)
	};

	return fetch(url, options).then(async response => {
		if (response.ok) {
			return response.json().then(result => {
				return result.result;
			});
		} else {
			throw new Error("Request is not OK");
		}
	});
}
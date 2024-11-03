import { getBalance, fromWei } from "../../lib/web3/web3Base.js";

import { getAllTokens } from "../../data/tokens.js";
import { getPoolById } from "../../data/pools.js";

const baseUrl = "https://api.coingecko.com/api/v3";

export async function getTokenPrices() {
	let tokens = getAllTokens();
	let coingeckoIds = tokens.map(token => token.coingeckoId);
	let filtered = coingeckoIds.filter(id => (id !== "") && (id !== "token-x"));

	let unique = [...new Set(filtered)];
	let ids = unique.join("%2C");

	let url = baseUrl + "/simple/price/?vs_currencies=usd&ids=" + ids;
	let response = await fetch(url);
	let json = await response.json();

	let prices = {};
	for (const key in json) {
		prices[key] = json[key].usd;
	}

	// let tokenXPricePool = getPoolById("BSC", 1);
	// let tokenXPrice = await getPriceByPool(tokenXPricePool);
	// prices["token-x"] = tokenXPrice;

	return prices;
}

export async function getPriceByPool(pool) {
	let tokenABalanceWei = await getBalance(pool.tokenA, pool.lpToken.contract);
	let tokenBBalanceWei = await getBalance(pool.tokenB, pool.lpToken.contract);

	let tokenABalance = fromWei(tokenABalanceWei);
	let tokenBBalance = fromWei(tokenBBalanceWei);

	return tokenBBalance / tokenABalance;
}
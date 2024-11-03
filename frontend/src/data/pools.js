import { getToken } from "./tokens.js";
import { getChain } from "./chains.js";
import { isTestnetPath } from "../lib/helper.js";

const pools = {
	ARB: [
		{
			orderId: 1,
			stakingContract: "",
			lpTokenContract: "",
			tokenASymbol: "tokenA",
			tokenBSymbol: "tokenB"
		}
	]
};

// ---- GET ALL POOLS ----

export function getPools() {
	let allPools = [];
	let currentPools = pools;

	if (!isTestnetPath()) {
		delete currentPools.ARB;
	}

	for (const [chainName, pools] of Object.entries(currentPools)) {
		let chain = getChain(chainName);

		let newPools = pools.map(pool => {
			let newPool = {
				...pool,
				chain: chain,
				tokenA: getToken(chainName, pool.tokenASymbol),
				tokenB: getToken(chainName, pool.tokenBSymbol),
				lpToken: {
					contract: pool.lpTokenContract,
					decimals: 18,
					chain: chain
				}
			};

			delete newPool.tokenASymbol;
			delete newPool.tokenBSymbol;
			delete newPool.lpTokenContract;

			return newPool;
		});

		allPools = [...allPools, ...Object.values(newPools)];
	}

	return allPools;
}

// ---- GET SPECIFIC POOL ----

export function getPoolById(chainName, poolId) {
	return getPools().find(pool => (pool.chain.nameId === chainName) && (pool.orderId === poolId));
}
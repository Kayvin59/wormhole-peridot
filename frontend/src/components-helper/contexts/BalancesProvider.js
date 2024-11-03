import { createContext, useContext, useState, useEffect } from "react";
import { ConnectionContext } from "./ConnectionProvider.js";
import { getOwnBalance } from "../../lib/web3/web3Base.js";

import { getChains } from "../../data/chains.js";
import { getAllTokens } from "../../data/tokens.js";

export const BalancesContext = createContext();

export function BalancesProvider({children}) {
	const [balances, setBalances] = useState(undefined);

	const { isConnected } = useContext(ConnectionContext);

	// ---- HOOKS ----

	useEffect(() => {
		updateBalances();
	}, [isConnected]);

	// ---- FUNCTIONS ----

	async function updateBalances() {
		if (isConnected === true) {
			let tokens = getAllTokens();
			let chainNameIds = getChains().map(chain => chain.nameId);
			let result = {};
		
			let promises = [];
		
			for (const chainNameId of chainNameIds) {
				result[chainNameId] = {};
				let tokensOfChain = tokens.filter(token => token.chain.nameId === chainNameId);
		
				let chainPromises = tokensOfChain.map(async token => {
					return getOwnBalance(token).then(balance => {
						result[chainNameId][token.symbol] = balance;
					});
				});
		
				promises = promises.concat(chainPromises);
			}
		
			await Promise.all(promises);

			setBalances({...result});
		}
	}

	function getBalance(token) {
		let balance = undefined;

		if (balances !== undefined) {
			balance = balances[token.chain.nameId][token.symbol];
		}

		return balance;
	}

	return (
		<BalancesContext.Provider value={{balances, getBalance, updateBalances}}>
			{children}
		</BalancesContext.Provider>
	);
}

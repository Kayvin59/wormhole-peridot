import { createContext, useState, useEffect } from "react";
import { defaultChain, getWeb3Provider, getAccount, getChainName, isCurrentChainSupported } from "../../lib/web3/web3Base.js";

export const ConnectionContext = createContext();

export function ConnectionProvider({children}) {
	const [isWeb3Available, setIsWeb3Available] = useState(undefined);
	const [isChainSupported, setIsChainSupported] = useState(undefined);
	const [isConnected, setIsConnected] = useState(undefined);
	const [connectedChain, setConnectedChain] = useState(undefined);
	const [supportedChain, setSupportedChain] = useState(undefined);

	useEffect(() => {
		getWeb3Provider().then(provider => {
			setIsWeb3Available(provider !== undefined);
		});
	}, []);

	useEffect(() => {
		if (isWeb3Available !== undefined) {
			if (isWeb3Available === true) {
				getAccount().then(account => {
					setIsConnected(!!account);
				});

				getChainName().then(chain => {
					setConnectedChain(chain);
				});

				isCurrentChainSupported().then(async result => {
					setIsChainSupported(result ?? false);

					let chain = undefined;
		
					if (result === true) {
						chain = await getChainName();
					} else {
						chain = defaultChain;
					}
		
					setSupportedChain(chain);
				});
			} else {
				setIsChainSupported(false);
				setIsConnected(false);
				setSupportedChain(defaultChain);
			}
		}
	}, [isWeb3Available]);

	return (
		<ConnectionContext.Provider value={{
			isWeb3Available,
			isChainSupported,
			isConnected,
			connectedChain,
			supportedChain
		}}>
			{children}
		</ConnectionContext.Provider>
	);
}

import { createContext, useState, useEffect } from "react";
import { getTokenPrices } from "../../lib/api/coingecko.js";

export const CoingeckoPricesContext = createContext();

export function CoingeckoPricesProvider({children}) {
	const [prices, setPrices] = useState(undefined);

	useEffect(() => {
		getTokenPrices().then(result => {
			setPrices(result);
		});
	}, []);

	return (
		<CoingeckoPricesContext.Provider value={prices}>
			{children}
		</CoingeckoPricesContext.Provider>
	);
}

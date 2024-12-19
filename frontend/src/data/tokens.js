import { getChain } from "./chains.js";
import { isTestnetPath } from "../lib/helper.js";

const basePath = "/images/tokens/";

const tokens = {
  ARB: [
    {
      symbol: "FFT",
      contract: "0x2F09A68A5Ba0Ea74D6140fCFB9cfFF64C982794e",
      decimals: 18,
      coingeckoId: "binance-usd",
      imagePath: basePath + "placeholder.svg",
    },
    {
      symbol: "ETH",
      decimals: 18,
      coingeckoId: "ethereum",
      imagePath: basePath + "ETH.svg",
    },
  ],
  BASE: [
    {
      symbol: "ETH",
      decimals: 18,
      coingeckoId: "ethereum",
      imagePath: basePath + "ETH.svg",
    },
  ],
};

// ---- GET ALL TOKENS ----

export function getAllTokens() {
  let allTokens = [];
  let currentTokens = tokens;

  if (!isTestnetPath()) {
    delete currentTokens.ARB;
  }

  for (const [chainName, tokens] of Object.entries(currentTokens)) {
    let chain = getChain(chainName);

    let newTokens = tokens.map((token) => {
      return { ...token, chain: chain };
    });

    allTokens = [...allTokens, ...Object.values(newTokens)];
  }

  return allTokens;
}

// ---- GET SPECIFIC TOKEN ----

export function getToken(chain, symbol) {
  return getAllTokens().find(
    (token) => token.chain.nameId === chain && token.symbol === symbol,
  );
}

export function getTokenByContract(chain, contract) {
  return getAllTokens().find(
    (token) => token.chain.nameId === chain && token.contract === contract,
  );
}

import { isTestnetPath } from "../lib/helper.js";

const chains = [
  {
    id: 421614,
    hex: "0x66eee",
    url: "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
    name: "Arbitrum Sepolia Testnet",
    nameId: "ARB",
    currency: {
      name: "Sepolia Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.arbiscan.io",
    lpSymbol: "UNI-LP",
    lpUrl: "https://app.uniswap.org/swap?chain=arbitrum-sepolia",
    marketUrl: "https://testnets.opensea.io/assets/arbitrum-sepolia",
    wrappedContract: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
    moralisId: undefined,
  },
  {
    id: 84532,
    hex: "0x14a34",
    url: "https://base-sepolia.gateway.tenderly.co",
    name: "Base Sepolia Testnet",
    nameId: "BASE",
    currency: {
      name: "Base Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.basescan.org",
    lpSymbol: undefined,
    lpUrl: undefined,
    marketUrl: undefined,
    wrappedContract: undefined,
    moralisId: undefined,
  },
];

export function getChains() {
  let filteredChains = chains;

  if (!isTestnetPath()) {
    filteredChains = filteredChains.filter((chain) => chain.id !== 421614);
  }

  return filteredChains;
}

export function getChain(nameId) {
  return chains.find((chain) => chain.nameId === nameId);
}

export function getChainById(id) {
  return chains.find((chain) => chain.id === id);
}

export function getWalletConnectChainIds() {
  let supportedIds = [421614];

  let chainIds = chains.map((chain) => chain.id);
  let filteredIds = chainIds.filter((id) => supportedIds.includes(id));

  return filteredIds;
}

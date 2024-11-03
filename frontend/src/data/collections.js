import { getChain } from "./chains";
import { getToken } from "./tokens";
import { isTestnetPath, toDateString } from "../lib/helper.js";

const collections = {
	ARB: [
		{
			blindBoxId: 1,
			name: "BAYC",
			nftTax: 3,
			tokenTax: 3,
			price: "0.000000000001",
			maxAmount: 1000,
			nft: {
				symbol: "NFT",
				contract: "0xdE3eC8AB5522796cad2892CBE8736436602152A3",
				imagePath: "/images/tokens/placeholder.svg" // TODO: add real image
			},
			miniNft: {
				symbol: "miniNFT",
				contract: "0xC13bE6327f65CA03CFF9dabED84aeDC80E226354",
				imagePath: "/images/tokens/placeholder.svg" // TODO: add real image
			},
			tokenSymbol: "FFT"
		}
	]
};

// ---- GET ALL COLLECTIONS ----

export function getCollections() {
	let allCollections = [];
	let currentCollections = collections;

	if (!isTestnetPath()) {
		delete currentCollections.ARB;
	}

	for (const [chainName, collections] of Object.entries(currentCollections)) {
		let chain = getChain(chainName);

		let newCollections = collections.map(collection => {
			let newCollection = {
				...collection,
				miniNftImagePath: "/images/collections/" + collection.name + "_miniNft.png",
				blindBoxImagePath: "/images/collections/" + collection.name + "_blindBox.png",
				marketLink: chain.marketUrl + "/" + collection.miniNft.contract + "/1",
				expirationDate: toDateString(collection.expirationDate),
				chain: chain,
				nft: {
					...collection.nft,
					decimals: 0,
					chain: chain
				},
				miniNft: {
					...collection.miniNft,
					decimals: 0,
					chain: chain
				},
				token: getToken(chainName, collection.tokenSymbol),
			};

			delete newCollection.tokenSymbol;

			return newCollection;
		});

		allCollections = [...allCollections, ...Object.values(newCollections)];
	}

	return allCollections;
}

// ---- GET SPECIFIC COLLECTION ----

export function getCollection(chainName, collectionName) {
	return getCollections().find(collection => (collection.chain.nameId === chainName) && (collection.name === collectionName));
}
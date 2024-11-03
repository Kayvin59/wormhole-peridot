import { web3Provider, currentAccount, getSendMessage, getChainName, toWei } from "./web3Base.js";

import { contracts } from "../../data/contracts.js";

import miniNftAbi from "../../data/abis/miniNft.json";
import wormholeIFOAbi from "../../data/abis/wormholeIFO.json";

// ---- INTERACTIONS ----

export async function mintBlindBox(miniNftAddress, amount, price) {
	let chain = await getChainName();

	if (chain === "ARB") {
		let miniNftContract = new web3Provider.Contract(miniNftAbi, miniNftAddress);

		let weiAmount = toWei(price).toString();
		let extraMessage = { value: weiAmount }; 

		return miniNftContract.methods.mintBlindBox(amount).send(getSendMessage(extraMessage));
	} else {
		let ifoContract = new web3Provider.Contract(wormholeIFOAbi, contracts.ARB.help.ifo);

		let targetChain = 10003;

		let weiAmount = toWei(price).toString();
		let value = BigInt(weiAmount) + BigInt("50000000000000000");
		let extraMessage = { value: value.toString() };

		return ifoContract.methods.sendMessage(
			targetChain,
			miniNftAddress,
			amount,
			miniNftAddress,
			currentAccount
		).send(getSendMessage(extraMessage));		
	}
}
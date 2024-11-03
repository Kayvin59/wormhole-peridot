import { web3Provider, currentAccount, getSendMessage, getChainName, toWei, approve } from "./web3Base.js";

import { contracts } from "../../data/contracts.js";

import basicTokenAbi from "../../data/abis/basicToken.json";
import destinationBridgeAbi from "../../data/abis/destinationBridge.json";
import sourceBridgeAbi from "../../data/abis/sourceBridge.json";

// ---- INTERACTIONS ----

export async function bridge(token, amount) {
	let chain = await getChainName();

	let bridgeAbi = undefined;
	let bridgeContractAddress = undefined;
	let targetChain = undefined;

	if (chain === "ARB") {
		bridgeAbi = sourceBridgeAbi;
		bridgeContractAddress = contracts[chain].help.sourceBridge;
		targetChain = 10004;
	} else {
		bridgeAbi = destinationBridgeAbi;
		bridgeContractAddress = contracts[chain].help.destinationBridge;
		targetChain = 10003;
	}

	let bridgeContract = new web3Provider.Contract(bridgeAbi, bridgeContractAddress);
	let fractionTokenContract = new web3Provider.Contract(basicTokenAbi, token.contract);

	let weiAmount = toWei(amount);

	return approve(fractionTokenContract, bridgeContractAddress, weiAmount).then(() => {
		return bridgeContract.methods.sendMessage(
			targetChain,
			currentAccount,
			token.contract,
			weiAmount,
			currentAccount
		).send(getSendMessage());
	});
}
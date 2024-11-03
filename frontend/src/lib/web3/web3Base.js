import Web3 from "web3";

import { getChains, getChainById } from "../../data/chains.js";
import { requestedChain, chainDoesNotExist } from "../../data/messages.js";

import basicTokenAbi from "../../data/abis/basicToken.json";

export const web3s = getChains().reduce((web3s, chain) => {
	web3s[chain.nameId] = getEthProvider(chain.url);
	
	return web3s;
}, {});

export const defaultChain = "ARB";

export let ethProvider = undefined; // window.ethereum
export let web3Provider = undefined;
export let currentAccount = undefined;

let areHandlersSet = false;

const metaMaskProvider = Web3.givenProvider;

// ---- RELOAD ON CHANGE ----

function onChangeHandlers(provider) {
	if (!areHandlersSet) {
		provider.on("chainChanged", () => {
			window.location.reload();
		});
	
		provider.on("accountsChanged", () => {
			window.location.reload();
		});

		areHandlersSet = true;
	}
}

// ---- PROVIDER ----

export function getEthProvider(provider) {
	return (new Web3(provider)).eth;
}

export async function getWeb3Provider() {
	let provider = undefined;

	let isMetaMask = isMetaMaskInstalled();

	if (isMetaMask) {
		provider = metaMaskProvider;
	}

	if (provider !== undefined) {
		ethProvider = provider;
		web3Provider = getEthProvider(provider);

		onChangeHandlers(provider);
	}

	return web3Provider;
}

// ---- PROVIDER - METAMASK ----

export function isMetaMaskInstalled() {
	return metaMaskProvider !== undefined && metaMaskProvider !== null;
}

export async function isMetaMaskConnected() {
	let provider = metaMaskProvider;
	let addresses = await provider.request({"method": "eth_accounts"});

	return addresses.length > 0;
}

export async function connectMetaMask() {
	let provider = getEthProvider(metaMaskProvider);

	return provider.requestAccounts().then(() => {
		ethProvider = metaMaskProvider;
		web3Provider = provider;

		onChangeHandlers(metaMaskProvider);

		window.location.reload();
	});
}

// ---- PROVIDER - WALLET CONNECT ----

export async function getWalletConnectProvider() {
	return undefined; // walletConnectProvider;
}

export async function isWalletConnectConnected() {
	let provider = await getWalletConnectProvider();
	
	return provider.accounts.length > 0;
}

export async function connectWalletConnect() {
	let provider = await getWalletConnectProvider();

	return provider.connect()
		.then(() => {
			ethProvider = provider;
			web3Provider = getEthProvider(provider);

			onChangeHandlers(provider);

			window.location.reload();
		})
		.catch(error => {
			if (error.message === "Requested chains are not supported") {
				alert(requestedChain());
			}
		});
}

export async function disconnectWalletConnect() {
	let provider = await getWalletConnectProvider();

	return provider.disconnect();
}

// ---- ACCOUNT ----

export async function getAccount() {
	let accounts = await web3Provider.getAccounts();

	currentAccount = accounts[0];

	return currentAccount;
}

// ---- SEND ----

export function getSendMessage(extraMessage) {
	return {
		from: currentAccount,
		maxPriorityFeePerGas: null,
		maxFeePerGas: null,
		...extraMessage
	};
}

// ---- GET CHAIN ----

export async function getChainId() {
	return web3Provider.net.getId();
}

// ---- GET EXTERNAL CHAIN DATA ----

export async function getExternalChainData() {
	let response = await fetch("https://chainid.network/chains.json");
	let json = await response.json();

	let chainId = await getChainId();
	let chainData = json.find(chain => chain.chainId === chainId);

	return chainData;
}

export async function getChainName() {
	let chainName = undefined;
	let chainData = await getExternalChainData();

	switch(chainData.chainId) {
		case 421614:
			chainName = "ARB";
			break;
		case 84532:
			chainName = "BASE";
			break;
		default:
			chainName = chainData.chain;
	}

	return chainName;
}

// ---- GET INTERNAL CHAIN DATA ----

export async function getInternalChainData() {
	const chainId = await getChainId();
	
	return getChainById(chainId);
}

export async function isCurrentChainSupported() {
	let currentId = await getChainId();
	let supportedIds = getChains().map(chain => chain.id);

	return supportedIds.includes(currentId);
}

// ---- GET BALANCE ----

export async function getBalance(token, ofAddress) {
	let balance = undefined;

	if (token.contract !== undefined) {
		let tokenContract = new web3s[token.chain.nameId].Contract(basicTokenAbi, token.contract);

		balance = await tokenContract.methods.balanceOf(ofAddress).call();
	} else {
		balance = await web3s[token.chain.nameId].getBalance(ofAddress);
	}

	return BigInt(balance);
}

export async function getOwnBalance(token) {
	let balance = await getBalance(token, currentAccount);
	let number = fromWei(balance, token.decimals);

	return number;
}

// ---- WEI ----

function getWeiUnit(decimals) {
	let unit = undefined;
	
	switch(decimals) {
		case 18:
			unit = "ether";
			break;
		case 12:
			unit = "microether";
			break;
		case 0:
			unit = "wei";
			break;
		default:
			break;
	}

	return unit;
}

export function fromWei(wei, decimals=18) {
	let unit = getWeiUnit(decimals);
	let value = Web3.utils.fromWei(wei.toString(), unit);

	return value;
}

export function toWei(number, decimals=18) {
	let unit = getWeiUnit(decimals);
	let value = Web3.utils.toWei(number.toString(), unit);

	return BigInt(value);
}

// ---- APPROVE ----

export async function getAllowance(baseContract, toApproveContract) {
	let allowance = await baseContract.methods.allowance(currentAccount, toApproveContract).call();

	return BigInt(allowance);
}

export async function approve(baseContract, toApproveContract, amount) {
	let allowance = await getAllowance(baseContract, toApproveContract);
	let amountBn = BigInt(amount);

	if (allowance < amountBn) {
		return baseContract.methods.approve(toApproveContract, amountBn).send({from: currentAccount});
	} else {
		return Promise.resolve();
	}
}

// ---- METAMASK - CHAIN ----

export async function switchChain(chain) {
	return ethProvider.request({
		method: "wallet_switchEthereumChain",
		params: [{ chainId: chain.hex }],
	}).catch(error => {
		if (error !== undefined) {
			if (error.code === 4902 || error.data?.originalError?.code === 4902) {
				return addChain(chain);
			} else if (error.message !== undefined && error.message.includes("Chain") && error.message.includes("not approved")) {
				alert(chainDoesNotExist());
			}
		}
	});
}

async function addChain(chain) {
	return ethProvider.request({
		method: "wallet_addEthereumChain",
		params: [{
			chainId: chain.hex,
			chainName: chain.name,
			nativeCurrency: chain.currency,
			rpcUrls: [chain.url],
			blockExplorerUrls: [chain.blockExplorer],
		}],
	});
}

// ---- METAMASK - TOKEN ----

export async function addTokenToMetamask(token) {
	return watchAsset(token.contract, token.symbol, token.decimals);
}

export async function addLPTokenToMetamask(token) {
	return watchAsset(token.contract, token.chain.lpSymbol, token.decimals);
}

async function watchAsset(contract, symbol, decimals) {
	return ethProvider.request({
		method: "wallet_watchAsset",
		params: {
			type: "ERC20",
			options: {
				address: contract,
				symbol: symbol,
				decimals: decimals
			},
		},
	});
}

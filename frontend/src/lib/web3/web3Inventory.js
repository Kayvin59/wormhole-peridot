import { web3Provider, getSendMessage } from "./web3Base.js";
import { getMiniNftCount } from "./web3BaseAdd.js";

import { contracts } from "../../data/contracts.js";

import miniNftAbi from "../../data/abis/miniNft.json";
import wormholeIFOAbi from "../../data/abis/wormholeIFO.json";

// ---- GETTER ----

export async function isRoundFinished(chain, miniNftAddress, maxAmount) {
  let miniNftCount = await getMiniNftCount(chain, miniNftAddress);

  return parseInt(miniNftCount) === maxAmount;
}

// ---- INTERACTIONS ----

export async function claimBlindBox(miniNftAddress, blindBoxId) {
  let miniNftContract = new web3Provider.Contract(miniNftAbi, miniNftAddress);

  return miniNftContract.methods
    .claimBlindBox(blindBoxId)
    .send(getSendMessage());
}

export async function claimFTT(miniNftAddress) {
  let ifoContract = new web3Provider.Contract(
    wormholeIFOAbi,
    contracts.ARB.help.ifo,
  );

  return ifoContract.methods
    .claimWrappedFTT(miniNftAddress)
    .send(getSendMessage());
}

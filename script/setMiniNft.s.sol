// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotMiniNFT} from "../src/fundraising/PeridotMiniNFT.sol";

contract SetPeridotFactory is Script {
    address constant fttSender = 0x1b9469dabA419E2e83BcB0831c0E31fa9B6401F2;
    address constant ifoPriceReceiver = 0x7CFe07cFfB3b9ead5F91E45b1aFd47b8E6B7d7C2;
    address constant peridotMiniNFT = 0xC13bE6327f65CA03CFF9dabED84aeDC80E226354;
    address constant fftAddress = 0x2F09A68A5Ba0Ea74D6140fCFB9cfFF64C982794e;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WormholeRelayer address
        PeridotMiniNFT _peridotMiniNFT = PeridotMiniNFT(payable(peridotMiniNFT));

        console.log("Attempting to set FFTContract for PeridotMiniNFT...");
        try _peridotMiniNFT.setFttContract(address(fftAddress)) {
            console.log("FFTContract set successfully:", fftAddress);
        } catch Error(string memory reason) {
            console.log("Failed to set PeridotMiniNFT:", reason);
        }

        console.log("Attempting to set FTTSender for PeridotMiniNFT...");
        try _peridotMiniNFT.setFttSender(address(fttSender)) {
            console.log("FTTSender set successfully:", fttSender);
        } catch Error(string memory reason) {
            console.log("Failed to set FTTSender:", reason);
        }

        console.log("Attempting to set IFOPriceReceiver for PeridotMiniNFT...");
        try _peridotMiniNFT.setIFOPriceReceiver(address(ifoPriceReceiver)) {
            console.log("IFOPriceReceiver set successfully:", ifoPriceReceiver);
        } catch Error(string memory reason) {
            console.log("Failed to set IFOPriceReceiver:", reason);
        }

        vm.stopBroadcast();
    }
}
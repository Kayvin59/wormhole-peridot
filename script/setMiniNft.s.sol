// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotMiniNFT} from "../src/fundraising/PeridotMiniNFT.sol";

contract SetPeridotFactory is Script {
    address constant fttSender = 0x1A514e4207DFd15617A8c8aB34A2b6B760eCAD02;
    address constant ifoPriceReceiver = 0x3141354f70D9519469501A32d59d915fc82D7593;
    address constant peridotMiniNFT = 0x6EeAac2a256b760615a5164449C3FC0998fEdBb5;
    address constant fftAddress = 0x24d954718A4A7CC661247a64523279D6c92d8d1F;

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
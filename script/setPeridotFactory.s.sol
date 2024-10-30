// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotTokenFactory} from "../src/fundraising/PeridotTokenFactory.sol";

contract SetPeridotFactory is Script {
    address constant DestinationChainFactory = 0x8547F1e3B77b9585247a1b9a605Fe3297F975a00;
    address constant FTTsender = 0x92197cC1800C563d2A5c2508cEd85aA439730ef9;
    uint constant targetChain = 10004;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WormholeRelayer address
        PeridotTokenFactory peridotTokenFactory = PeridotTokenFactory(payable(0x7B650Ba8563D4Ea7e8E4e21f6fC936A16ba51967));

        console.log("Attempting to set FTT Sender...");
        try peridotTokenFactory.setFTTSender(FTTsender) {
            console.log("FTT Sender set successfully:", FTTsender);
        } catch Error(string memory reason) {
            console.log("Failed to set FTT Sender:", reason);
        }        

        vm.stopBroadcast();
    }
}
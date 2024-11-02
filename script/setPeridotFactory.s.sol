// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotTokenFactory} from "../src/fundraising/PeridotTokenFactory.sol";

contract SetPeridotFactory is Script {
    address constant FTTsender = 0x1b9469dabA419E2e83BcB0831c0E31fa9B6401F2;
    address constant DestinationChainFactory = 0xCe72970948809B917955F40A3DbF19F332561b59;
    address constant IIFOPriceReceiver = 0x7CFe07cFfB3b9ead5F91E45b1aFd47b8E6B7d7C2;
    uint16 constant targetChain = 10004;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WormholeRelayer address
        PeridotTokenFactory peridotTokenFactory = PeridotTokenFactory(payable(0x6Bd3a2F6b91830E964a5b3906E0DBF92a5A5Cc53));

        console.log("Attempting to set FTT Sender...");
        try peridotTokenFactory.setFTTSender(FTTsender) {
            console.log("FTT Sender set successfully:", FTTsender);
        } catch Error(string memory reason) {
            console.log("Failed to set FTT Sender:", reason);
        }  

        console.log("Attempting to set Destination Chain Factory...");
        try peridotTokenFactory.setDestinationFactory(targetChain, DestinationChainFactory) {
            console.log("Destination Chain Factory set successfully:", DestinationChainFactory);
        } catch Error(string memory reason) {
            console.log("Failed to set Destination Chain Factory:", reason);
        }  

        console.log("Attempting to set IFO Price Receiver...");
        try peridotTokenFactory.setIFOPriceReceiver(IIFOPriceReceiver) {
            console.log("IFO Price Receiver set successfully:", IIFOPriceReceiver);
        } catch Error(string memory reason) {
            console.log("Failed to set IFO Price Receiver:", reason);
        }      

        vm.stopBroadcast();
    }
}
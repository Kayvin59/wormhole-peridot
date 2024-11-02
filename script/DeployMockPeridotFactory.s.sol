// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/fundraising/MockPeridotFactory.sol";

contract DeployPeridotSwap is Script {
    address constant wormholeRelayer = 0xAd753479354283eEE1b86c9470c84D42f229FF43;
    address constant DestinationChainFactory = 0xCe72970948809B917955F40A3DbF19F332561b59;
    uint16 constant targetChain = 10004;


    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WitnetRandomness address
        MockPeridotTokenFactory peridotTokenFactory = new MockPeridotTokenFactory(wormholeRelayer);
        console.log("PeridotFactory deployed to:", address(peridotTokenFactory));

        console.log("Attempting to set Destination Chain Factory...");
        try peridotTokenFactory.setDestinationFactory(targetChain, DestinationChainFactory) {
            console.log("Destination Chain Factory set successfully:", DestinationChainFactory);
        } catch Error(string memory reason) {
            console.log("Failed to set Destination Chain Factory:", reason);
        }

        vm.stopBroadcast();
    }
}
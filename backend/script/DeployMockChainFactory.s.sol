// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/wormhole/DestinationChainContracts/MockChainFactory.sol";

contract DeployPeridotSwap is Script {
    address constant wormholeRelayer = 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WitnetRandomness address
        DestinationChainFactory peridotTokenFactory = new DestinationChainFactory(wormholeRelayer);
        console.log("Mock Chain Factory deployed to:", address(peridotTokenFactory));

        vm.stopBroadcast();
    }
}
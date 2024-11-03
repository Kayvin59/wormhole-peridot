// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/test/SimpleStorage.sol";

contract DeployPeridotSwap is Script {
    address constant wormholeRelayer = 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        SimpleStorage simpleStorage = new SimpleStorage(wormholeRelayer);
        console.log("SimpleStorage deployed to:", address(simpleStorage));

        vm.stopBroadcast();
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/fundraising/MockPeridotFactory.sol";

contract DeployPeridotSwap is Script {
    address constant wormholeRelayer = 0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470;
    address constant DestinationChainFactory = 0xDBf807a7b535Fa75502d92749CDC306794E7fcF2;
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
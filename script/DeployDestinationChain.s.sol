// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {DestinationChainFactory} from "../src/wormhole/DestinationChainContracts/DestinationChainFactory.sol";

contract DeployWormholeSource is Script {
    // Replace with the actual WitnetRandomness address
    address constant wormholeRelayer = 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE;
    address constant PeridotTokenFactory = 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE; // Replace with the deployed MockPeridotTokenFactory address
    uint16 constant targetChain = 10003; //Arbitrum Sepolia

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        DestinationChainFactory destinationChainFactory = new DestinationChainFactory(wormholeRelayer);
        console.log("DestinationChainFactory deployed to:", address(destinationChainFactory));

        console.log("Attempting to set DestinationChainFactory...");
        try destinationChainFactory.registerSender(uint16(targetChain), addressToBytes32(PeridotTokenFactory)) {
            console.log("DestinationChainFactory set successfully:", targetChain, PeridotTokenFactory);
        } catch Error(string memory reason) {
            console.log("Failed to set DestinationChainFactory:", reason);
        }  

        vm.stopBroadcast();
    }
}

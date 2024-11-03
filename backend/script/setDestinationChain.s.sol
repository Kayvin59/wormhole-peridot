// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {DestinationChainFactory} from "../src/wormhole/DestinationChainContracts/DestinationChainFactory.sol";

contract DeployWormholeSource is Script {
    // Replace with the actual WitnetRandomness address
    address constant wormholeRelayer = 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE;
    address constant PeridotTokenFactory = 0x32e29c4bD3F800A693aBeeF863fF99585dE20d7e; // Replace with the deployed MockPeridotTokenFactory address
    uint16 constant targetChain = 10003; //Arbitrum Sepolia

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        DestinationChainFactory destinationChainFactory = DestinationChainFactory(payable(0xCe72970948809B917955F40A3DbF19F332561b59));

        console.log("Attempting to set DestinationChainFactory...");
        try destinationChainFactory.registerSender(uint16(targetChain), addressToBytes32(PeridotTokenFactory)) {
            console.log("DestinationChainFactory set successfully:", targetChain, PeridotTokenFactory);
        } catch Error(string memory reason) {
            console.log("Failed to set DestinationChainFactory:", reason);
        }  

        vm.stopBroadcast();
    }
}
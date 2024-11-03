// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/wormhole/DestinationChainContracts/MockChainFactory.sol";

contract DeployPeridotSwap is Script {
    address constant MockFactory = 0x5438Aa5D536a0DC6a03327f13598a3D9535bEd35;
    uint16 constant targetChain = 10004;

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }


    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        DestinationChainFactory peridotTokenFactory = DestinationChainFactory(payable(0xDBf807a7b535Fa75502d92749CDC306794E7fcF2));

        console.log("Attempting to set Destination Chain Factory...");
        try peridotTokenFactory.registerSender(uint16(targetChain), addressToBytes32(MockFactory)) {
            console.log("Destination Chain Factory set successfully:",targetChain, address(MockFactory));
        } catch Error(string memory reason) {
            console.log("Failed to set Destination Chain Factory:", reason);
        }

        vm.stopBroadcast();
    }
}
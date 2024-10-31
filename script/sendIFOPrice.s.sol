// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {SimpleStorage} from "../src/test/SimpleStorage.sol";

contract SetRegisteredSender is Script {
    address constant sourceStorage = 0xf92397D44E89E56D53B8BF0479EAaCaBe9cB36cB;
    uint16 constant targetChain = 10003;

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        SimpleStorage simpleStorage = SimpleStorage(payable(0x342c7E29919429c6A708E10AeF42706ef211B4B6));


        console.log("Attempting to set SimpleStorage...");
        try simpleStorage.setRegisteredSender(uint16(targetChain), addressToBytes32(sourceStorage)) {
            console.log("SimpleStorage set successfully:", targetChain, sourceStorage);
        } catch Error(string memory reason) {
            console.log("Failed to set SimpleStorage:", reason);
        }        


        vm.stopBroadcast();
    }
}
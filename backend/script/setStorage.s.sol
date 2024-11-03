// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {SimpleStorage} from "../src/test/SimpleStorage.sol";

contract SetRegisteredSender is Script {
    address constant sourceStorage = 0xc6e3f8Fa7C6683ce700bB5754e7716C4AF9237eE;
    uint16 constant targetChain = 10003;

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

   /*function addressToBytes32(address addr) internal pure returns (bytes32) {
       bytes32 senderBytes32 = keccak256(abi.encodePacked(addr));
       return senderBytes32;
   }*/

   /*
   function addressToBytes32(address addr) internal pure returns (bytes32) {
       bytes senderBytes32 = bytes32(bytes20(addr));
       return senderBytes32;
   }
   */

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        SimpleStorage simpleStorage = SimpleStorage(payable(0x6dB8f2594AcaD1673aEaCB52da139665e7d7de14));


        console.log("Attempting to set SimpleStorage...");
        try simpleStorage.setRegisteredSender(uint16(targetChain), addressToBytes32(sourceStorage)) {
            console.log("SimpleStorage set successfully:", targetChain, sourceStorage);
        } catch Error(string memory reason) {
            console.log("Failed to set SimpleStorage:", reason);
        }        


        vm.stopBroadcast();
    }
}
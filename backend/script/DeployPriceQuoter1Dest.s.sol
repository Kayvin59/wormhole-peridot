// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {IFOPriceReceiver1} from "../src/wormhole/SourceChainContracts/IFOPriceReceiver1.sol";
import "../src/wormhole/DestinationChainContracts/IFOPriceQuoter1.sol";

contract DeployPeridotSwap is Script {
    address constant wormholeRelayer = 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE;
    address constant wormholeIFO = 0x97F8F160DbfEFB505579B11EDa3a373b97E9E649;
    address constant iFOPriceReceiver1 = 0xB6fC28a570bF2FAfAd115195E4EB7dE7a801ba88;
    uint16 constant targetChain = 10003; //Arbitrum Sepolia

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        IFOPriceQuoter1 iFOPriceQuoter1 = new IFOPriceQuoter1(wormholeRelayer, address(wormholeIFO));
        console.log("IFOPriceQuoter1 deployed to:", address(iFOPriceQuoter1));

        console.log("Attempting to set IFOPriceQuoter...");
        try iFOPriceQuoter1.setRegisteredSender(uint16(targetChain), addressToBytes32(iFOPriceReceiver1)) {
            console.log("IFOPriceQuoter1 set successfully:", targetChain, iFOPriceReceiver1);
        } catch Error(string memory reason) {
            console.log("Failed to set IFOPriceQuoter1:", reason);
        }

        vm.stopBroadcast();
    }
}
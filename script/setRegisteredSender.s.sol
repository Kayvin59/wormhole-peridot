// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotMiniNFT} from "../src/fundraising/PeridotMiniNFT.sol";
import {FTTSourceBridge} from "../src/wormhole/SourceChainContracts/FTTSourceBridge.sol";
import {IFOPriceReceiver1} from "../src/wormhole/SourceChainContracts/IFOPriceReceiver1.sol";

contract SetRegisteredSender is Script {
    address constant WormholeIFO = 0xffdA707Cdd2AAf2a4c10d84aC9Dd228DEf141AE4;
    address constant FTTDestinationBridge = 0x5D355488edb187b2b6D6aB145778957b5aA18a65;
    address constant IFOPriceQuoter = 0x68b9bA193E1901E0400cB3be1dF72Af58A226f68;
    uint16 constant targetChain = 10004;

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WormholeRelayer address
        PeridotMiniNFT peridotMiniNFT = PeridotMiniNFT(payable(0x6EeAac2a256b760615a5164449C3FC0998fEdBb5));

        FTTSourceBridge fttSourceBridge = FTTSourceBridge(payable(0x1A514e4207DFd15617A8c8aB34A2b6B760eCAD02));

        IFOPriceReceiver1 ifoPriceReceiver1 = IFOPriceReceiver1(payable(0x3141354f70D9519469501A32d59d915fc82D7593));

        console.log("Attempting to set PeridotMiniNFT...");
        try peridotMiniNFT.setRegisteredSender(uint16(targetChain), addressToBytes32(WormholeIFO)) {
            console.log("PeridotMiniNFT set successfully:", targetChain, WormholeIFO);
        } catch Error(string memory reason) {
            console.log("Failed to set PeridotMiniNFT:", reason);
        }        

        console.log("Attempting to set FTTSourceBridge...");
        try fttSourceBridge.registerSender(uint16(targetChain), addressToBytes32(WormholeIFO)) {
            console.log("FTTSourceBridge set successfully:", targetChain, WormholeIFO);
        } catch Error(string memory reason) {
            console.log("Failed to set FTTSourceBridge:", reason);
        }

        console.log("Attempting to set IFOPriceReceiver1...");
        try ifoPriceReceiver1.setRegisteredSender(uint16(targetChain), addressToBytes32(WormholeIFO)) {
            console.log("IFOPriceReceiver1 set successfully:", targetChain, WormholeIFO);
        } catch Error(string memory reason) {
            console.log("Failed to set IFOPriceReceiver1:", reason);
        }

        vm.stopBroadcast();
    }
}
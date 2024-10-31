// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotMiniNFT} from "../src/fundraising/PeridotMiniNFT.sol";
import {FTTSourceBridge} from "../src/wormhole/SourceChainContracts/FTTSourceBridge.sol";
import {IFOPriceReceiver1} from "../src/wormhole/SourceChainContracts/IFOPriceReceiver1.sol";

contract SetRegisteredSender is Script {
    address constant WormholeIFO = 0xEB3fa52874Ef93262b636c98D1bc0B7b427b41aD;
    address constant FTTDestinationBridge = 0xd3167fBADd8Eac1b1b60A5adfCF504d15dC56005;
    address constant IFOPriceQuoter = 0x056B0E9b04D535c82d2442e6030b53208c98cc86;
    uint16 constant targetChain = 10004;

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WormholeRelayer address
        PeridotMiniNFT peridotMiniNFT = PeridotMiniNFT(payable(0xC13bE6327f65CA03CFF9dabED84aeDC80E226354));

        FTTSourceBridge fttSourceBridge = FTTSourceBridge(payable(0x1b9469dabA419E2e83BcB0831c0E31fa9B6401F2));

        IFOPriceReceiver1 ifoPriceReceiver1 = IFOPriceReceiver1(payable(0x7CFe07cFfB3b9ead5F91E45b1aFd47b8E6B7d7C2));

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
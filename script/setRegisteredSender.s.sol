// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotMiniNFT} from "../src/fundraising/PeridotMiniNFT.sol";
import {FTTSourceBridge} from "../src/wormhole/SourceChainContracts/FTTSourceBridge.sol";
import {IFOPriceReceiver1} from "../src/wormhole/SourceChainContracts/IFOPriceReceiver1.sol";

contract SetRegisteredSender is Script {
    address constant WormholeIFO = 0x11cdE31c5F08d4619f883874811F0EaC0abF4fa8;
    address constant FTTDestinationBridge = 0xFd5078F159b451F38E3B0E341770f102eed65A9a;
    address constant IFOPriceQuoter = 0x4f74a4B2c5F95360d3282Ec7342bbC91877D74e2;
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
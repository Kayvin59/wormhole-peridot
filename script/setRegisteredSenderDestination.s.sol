// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {DestinationChainFactory} from "../src/wormhole/DestinationChainContracts/DestinationChainFactory.sol";
import {FTTDestinationBridge} from "../src/wormhole/DestinationChainContracts/FTTDestinationBridge.sol";
import {IFOPriceQuoter1} from "../src/wormhole/DestinationChainContracts/IFOPriceQuoter1.sol";
import {WormholeIFO} from "../src/wormhole/DestinationChainContracts/WormholeIFO.sol";

contract SetRegisteredSenderDestination is Script {
    address constant PeridotMiniNFT = 0xC13bE6327f65CA03CFF9dabED84aeDC80E226354;
    address constant IFOPriceReceiver1 = 0x7CFe07cFfB3b9ead5F91E45b1aFd47b8E6B7d7C2;
    address constant FTTSourceBridge = 0x1b9469dabA419E2e83BcB0831c0E31fa9B6401F2;
    address constant PeridotTokenFactory = 0x6Bd3a2F6b91830E964a5b3906E0DBF92a5A5Cc53;
    uint16 constant targetChain = 10003; //Arbitrum Sepolia

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Interacting with the contracts
        DestinationChainFactory destinationChainFactory = DestinationChainFactory(payable(0x81d5D8CfD800af754BfD163A7c192541e6F60B55));

        IFOPriceQuoter1 ifoPriceQuoter1 = IFOPriceQuoter1(payable(0x056B0E9b04D535c82d2442e6030b53208c98cc86));

        FTTDestinationBridge fttDestinationBridge = FTTDestinationBridge(payable(0xd3167fBADd8Eac1b1b60A5adfCF504d15dC56005));

        WormholeIFO wormholeIFO = WormholeIFO(payable(0xEB3fa52874Ef93262b636c98D1bc0B7b427b41aD));

        console.log("Attempting to set DestinationChainFactory...");
        try destinationChainFactory.registerSender(uint16(targetChain), addressToBytes32(PeridotTokenFactory)) {
            console.log("DestinationChainFactory set successfully:", targetChain, PeridotTokenFactory);
        } catch Error(string memory reason) {
            console.log("Failed to set DestinationChainFactory:", reason);
        }        

        console.log("Attempting to set IFOPriceQuoter1...");
        try ifoPriceQuoter1.setRegisteredSender(uint16(targetChain), addressToBytes32(IFOPriceReceiver1)) {
            console.log("IFOPriceQuoter set successfully:", targetChain, IFOPriceReceiver1);
        } catch Error(string memory reason) {
            console.log("Failed to set IFOPriceQuoter1:", reason);
        }

        console.log("Attempting to set FTTDestinationBridge...");
        try fttDestinationBridge.registerSender(uint16(targetChain), addressToBytes32(FTTSourceBridge)) {
            console.log("FTTDestinationBridge set successfully:", targetChain, FTTSourceBridge);
        } catch Error(string memory reason) {
            console.log("Failed to set FTTDestinationBridge:", reason);
        }

        console.log("Attempting to set WormholeIFO...");
        try wormholeIFO.setRegisteredSender(uint16(targetChain), addressToBytes32(PeridotMiniNFT)) {
            console.log("WormholeIFO set successfully:", targetChain, PeridotMiniNFT);
        } catch Error(string memory reason) {
            console.log("Failed to set WormholeIFO:", reason);
        }

        vm.stopBroadcast();
    }
}
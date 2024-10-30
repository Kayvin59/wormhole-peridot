// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {DestinationChainFactory} from "../src/wormhole/DestinationChainContracts/DestinationChainFactory.sol";
import {FTTDestinationBridge} from "../src/wormhole/DestinationChainContracts/FTTDestinationBridge.sol";
import {IFOPriceQuoter1} from "../src/wormhole/DestinationChainContracts/IFOPriceQuoter1.sol";
import {WormholeIFO} from "../src/wormhole/DestinationChainContracts/WormholeIFO.sol";

contract SetRegisteredSenderDestination is Script {
    address constant PeridotMiniNFT = 0x6EeAac2a256b760615a5164449C3FC0998fEdBb5;
    address constant IFOPriceReceiver1 = 0x3141354f70D9519469501A32d59d915fc82D7593;
    address constant FTTSourceBridge = 0x1A514e4207DFd15617A8c8aB34A2b6B760eCAD02;
    address constant PeridotTokenFactory = 0xd03B436C5618715540ba01Bd1EB10243b210EF7f;
    uint16 constant targetChain = 10003; //Arbitrum Sepolia

    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Interacting with the contracts
        DestinationChainFactory destinationChainFactory = DestinationChainFactory(payable(0xf8c0247d7Ec25CB3fBE5d5C510f20592006Ef13C));

        IFOPriceQuoter1 ifoPriceQuoter1 = IFOPriceQuoter1(payable(0x68b9bA193E1901E0400cB3be1dF72Af58A226f68));

        FTTDestinationBridge fttDestinationBridge = FTTDestinationBridge(payable(0x5D355488edb187b2b6D6aB145778957b5aA18a65));

        WormholeIFO wormholeIFO = WormholeIFO(payable(0xffdA707Cdd2AAf2a4c10d84aC9Dd228DEf141AE4));

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
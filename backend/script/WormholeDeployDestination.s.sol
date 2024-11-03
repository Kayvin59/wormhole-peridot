// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {IFOPriceQuoter1} from "../src/wormhole/DestinationChainContracts/IFOPriceQuoter1.sol";
import {DestinationChainFactory} from "../src/wormhole/DestinationChainContracts/DestinationChainFactory.sol";
import {WormholeIFO} from "../src/wormhole/DestinationChainContracts/WormholeIFO.sol";
import {FTTDestinationBridge} from "../src/wormhole/DestinationChainContracts/FTTDestinationBridge.sol";

contract DeployWormholeSource is Script {
    // Replace with the actual WitnetRandomness address
    address constant wormholeRelayer = 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        DestinationChainFactory destinationChainFactory = new DestinationChainFactory(wormholeRelayer);
        console.log("DestinationChainFactory deployed to:", address(destinationChainFactory));

        WormholeIFO wormholeIFO = new WormholeIFO(wormholeRelayer, address(destinationChainFactory));
        console.log("WormholeIFO deployed to:", address(wormholeIFO));

        IFOPriceQuoter1 iFOPriceQuoter1 = new IFOPriceQuoter1(wormholeRelayer, address(wormholeIFO));
        console.log("IFOPriceQuoter1 deployed to:", address(iFOPriceQuoter1));

        FTTDestinationBridge fttDestinationBridge = new FTTDestinationBridge(wormholeRelayer, address(wormholeIFO));
        console.log("FTTDestinationBridge deployed to:", address(fttDestinationBridge));

        vm.stopBroadcast();
    }
}

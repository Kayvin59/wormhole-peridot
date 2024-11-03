// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/wormhole/SourceChainContracts/FTTSourceBridge.sol";
import "../src/wormhole/SourceChainContracts/IFOPriceReceiver.sol";

contract DeployWormholeSource is Script {
    // Replace with the actual WitnetRandomness address
    address constant wormholeRelayer = 0xAd753479354283eEE1b86c9470c84D42f229FF43;
    address constant peridotSwap = 0x5217EF5c11A3033744a2d8f869a802DAf698c0E0;
    address constant peridotFactory = 0x2985495f47594b9A3cD4ad3b9753B87143c6C3fa;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        FTTSourceBridge fttSourceBridge = new FTTSourceBridge(wormholeRelayer, peridotSwap);
        console.log("FTTSourceBridge deployed to:", address(fttSourceBridge));

        IFOPriceReceiver ifoPriceReceiver = new IFOPriceReceiver(wormholeRelayer, peridotFactory);
        console.log("IFOPriceReceiver deployed to:", address(ifoPriceReceiver));

        vm.stopBroadcast();
    }
}
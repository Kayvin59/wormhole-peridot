// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/wormhole/SourceChainContracts/IFOPriceReceiver1.sol";

contract DeployPeridotSwap is Script {
    address constant wormholeRelayer = 0xAd753479354283eEE1b86c9470c84D42f229FF43;
    address constant peridotTokenFactory = 0xD49ac115b63E0402a6650B0C791ac89a0876Df3b;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        IFOPriceReceiver1 iFOPriceReceiver1 = new IFOPriceReceiver1(wormholeRelayer, address(peridotTokenFactory));
        console.log("IFOPriceReceiver deployed to:", address(iFOPriceReceiver1));

        vm.stopBroadcast();
    }
}
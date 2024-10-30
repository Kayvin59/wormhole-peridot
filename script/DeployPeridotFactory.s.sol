// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/fundraising/PeridotTokenFactory.sol";

contract DeployPeridotSwap is Script {
    // Replace with the actual WitnetRandomness address
    address constant daoAddress = 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;
    address constant swapAddress = 0x5217EF5c11A3033744a2d8f869a802DAf698c0E0;
    address constant vaultAddress = 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;
    address constant PFvaultAddress = 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;
    address constant wormholeRelayer = 0xAd753479354283eEE1b86c9470c84D42f229FF43;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WitnetRandomness address
        PeridotTokenFactory peridotTokenFactory = new PeridotTokenFactory(daoAddress, swapAddress, vaultAddress, PFvaultAddress, wormholeRelayer);
        console.log("PeridotFactory deployed to:", address(peridotTokenFactory));

        vm.stopBroadcast();
    }
}
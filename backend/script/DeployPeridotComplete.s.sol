// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/fundraising/PeridotSwap.sol";
import "../src/fundraising/PeridotTokenFactory.sol";
import "../src/wormhole/SourceChainContracts/IFOPriceReceiver1.sol";
import "../src/wormhole/SourceChainContracts/FTTSourceBridge.sol";

contract DeployPeridotSwap is Script {
    // Replace with the actual WitnetRandomness address
    address constant WITNET_RANDOMNESS = 0xC0FFEE98AD1434aCbDB894BbB752e138c1006fAB;
    address constant daoAddress = 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;
    address constant vaultAddress = 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;
    address constant pFvaultAddress = 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;
    address constant wormholeRelayer = 0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WitnetRandomness address
        PeridotSwap peridotSwap = new PeridotSwap(WITNET_RANDOMNESS);
        console.log("PeridotSwap deployed to:", address(peridotSwap));

        PeridotTokenFactory peridotTokenFactory = new PeridotTokenFactory(daoAddress, address(peridotSwap), vaultAddress, pFvaultAddress, wormholeRelayer);
        console.log("PeridotTokenFactory deployed to:", address(peridotTokenFactory));

        FTTSourceBridge fttSourceBridge = new FTTSourceBridge(wormholeRelayer, address(peridotSwap));
        console.log("FTTSourceBridge deployed to:", address(fttSourceBridge));

        IFOPriceReceiver1 iFOPriceReceiver1 = new IFOPriceReceiver1(wormholeRelayer, address(peridotTokenFactory));
        console.log("IFOPriceReceiver1 deployed to:", address(iFOPriceReceiver1));

        peridotSwap.updateFactory(address(peridotTokenFactory));

        peridotTokenFactory.setIFOPriceReceiver(address(iFOPriceReceiver1));

        peridotTokenFactory.setFTTSender(address(fttSourceBridge));

        vm.stopBroadcast();
    }
}
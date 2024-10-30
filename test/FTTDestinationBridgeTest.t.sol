// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import "../src/wormhole/DestinationChainContracts/FTTDestinationBridge.sol";
import "../src/wormhole/DestinationChainContracts/DestinationChainFactory.sol";

contract FTTDestinationBridgeTest is Test {
    FTTDestinationBridge bridge;
    DestinationChainFactory factory;
    address owner = address(0xABCD);
    address nonOwner = address(0xDCBA);
    address newDestinationFactory = address(0x1234);
    address initialWormholeRelayer = address(0x5678);

    function setUp() public {
        vm.startPrank(owner);
        factory = new DestinationChainFactory(initialWormholeRelayer);
        bridge = new FTTDestinationBridge(initialWormholeRelayer, address(factory));
        vm.stopPrank();
    }

    function testSetDestinationFactoryAsOwner() public {
        vm.startPrank(owner);
        bridge.setDestinationFactory(newDestinationFactory);
        assertEq(address(bridge.destinationFactory()), newDestinationFactory, "DestinationFactory not set correctly");
        vm.stopPrank();
    }

    function testSetDestinationFactoryAsNonOwner() public {
        vm.startPrank(nonOwner);
        vm.expectRevert("Ownable: caller is not the owner");
        bridge.setDestinationFactory(newDestinationFactory);
        vm.stopPrank();
    }
}
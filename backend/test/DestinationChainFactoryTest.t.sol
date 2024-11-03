// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import "../src/wormhole/DestinationChainContracts/DestinationChainFactory.sol";

contract DestinationChainFactoryTest is Test {
    DestinationChainFactory factory;
    address owner = address(0xABCD);
    address nonOwner = address(0xDCBA);
    address newWormholeRelayer = address(0x1234);

    function setUp() public {
        vm.startPrank(owner);
        factory = new DestinationChainFactory(address(0)); // Initialize with zero address
        vm.stopPrank();
    }

    function testSetWormholeRelayerAsOwner() public {
        vm.startPrank(owner);
        factory.setWormholeRelayer(newWormholeRelayer);
        
        // Cast IWormholeRelayer to address
        address actualRelayer = address(factory.wormholeRelayer());
        
        // Perform the assertion with both arguments as addresses
        assertEq(actualRelayer, newWormholeRelayer, "WormholeRelayer not set correctly");
        vm.stopPrank();
    }

    function testSetWormholeRelayerAsNonOwner() public {
        vm.startPrank(nonOwner);
        vm.expectRevert("Ownable: caller is not the owner");
        factory.setWormholeRelayer(newWormholeRelayer);
        vm.stopPrank();
    }
}
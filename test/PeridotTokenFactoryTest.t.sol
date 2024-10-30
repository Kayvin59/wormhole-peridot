// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import "../src/fundraising/PeridotTokenFactory.sol";

contract PeridotTokenFactoryTest is Test {
    PeridotTokenFactory factory;
    address owner = address(0xABCD);
    address nonOwner = address(0xDCBA);
    address newDestinationFactory = address(0x1234);
    address daoAddress = address(0x5678);
    address swapAddress = address(0x9ABC);
    address vaultAddress = address(0xDEF0);
    address pfVaultAddress = address(0x1111);
    address wormholeRelayer = address(0x2222);

    function setUp() public {
        vm.startPrank(owner);
        factory = new PeridotTokenFactory(
            daoAddress,
            swapAddress,
            vaultAddress,
            pfVaultAddress,
            wormholeRelayer
        );
        vm.stopPrank();
    }

    function testSetDestinationFactoryAsOwner() public {
        uint16 targetChain = 10004;
        vm.startPrank(owner);
        factory.setDestinationFactory(targetChain, newDestinationFactory);
        assertEq(factory.destinationFactories(targetChain), newDestinationFactory, "DestinationFactory not set correctly");
        vm.stopPrank();
    }

    function testSetDestinationFactoryAsNonOwner() public {
        uint16 targetChain = 10004;
        vm.startPrank(nonOwner);
        vm.expectRevert("Peridot: invalid caller");
        factory.setDestinationFactory(targetChain, newDestinationFactory);
        vm.stopPrank();
    }
}
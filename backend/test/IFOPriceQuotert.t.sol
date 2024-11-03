// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import "../src/wormhole/DestinationChainContracts/IFOPriceQuoter.sol";

contract IFOPriceQuoterTest is Test {
    IFOPriceQuoter quoter;
    address owner = address(0xABCD);
    address nonOwner = address(0xDCBA);
    uint16 sourceChain = 1001;
    bytes32 sourceAddress = bytes32(uint256(0xABCDEF));

    function setUp() public {
        vm.startPrank(owner);
        quoter = new IFOPriceQuoter(address(0)); // Initialize with zero WormholeRelayer address
        vm.stopPrank();
    }

    function testSetRegisteredSenderAsOwner() public {
        vm.startPrank(owner);
        quoter.setRegisteredSender(sourceChain, sourceAddress);
        bytes32 registered = quoter.registeredSenders(sourceChain);
        assertEq(registered, sourceAddress, "Sender not registered correctly");
        vm.stopPrank();
    }

    function testSetRegisteredSenderAsNonOwner() public {
        vm.startPrank(nonOwner);
        vm.expectRevert("Ownable: caller is not the owner");
        quoter.setRegisteredSender(sourceChain, sourceAddress);
        vm.stopPrank();
    }
}
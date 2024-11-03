// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import "../src/wormhole/SourceChainContracts/FTTSourceBridge.sol";

contract FTTSourceBridgeTest is Test {
    FTTSourceBridge bridge;
    address owner = address(0xABCD);
    address nonOwner = address(0xDCBA);
    address wormholeRelayer = address(0x5678);
    uint16 sourceChain = 1001;
    bytes32 sourceAddress = bytes32(uint256(0xABCDEF));

    function setUp() public {
        vm.startPrank(owner);
        bridge = new FTTSourceBridge(wormholeRelayer, address(0)); // Initialize with zero PeridotSwap address
        vm.stopPrank();
    }

    function testRegisterSenderAsOwner() public {
        vm.startPrank(owner);
        bridge.registerSender(sourceChain, sourceAddress);
        bytes32 registered = bridge.registeredSenders(sourceChain);
        assertEq(registered, sourceAddress, "Sender not registered correctly");
        vm.stopPrank();
    }

    function testRegisterSenderAsNonOwner() public {
        vm.startPrank(nonOwner);
        vm.expectRevert("Ownable: caller is not the owner");
        bridge.registerSender(sourceChain, sourceAddress);
        vm.stopPrank();
    }
}
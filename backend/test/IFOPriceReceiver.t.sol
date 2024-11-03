// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import "../src/wormhole/SourceChainContracts/IFOPriceReceiver.sol";

// Extend IFOPriceReceiver to expose the internal bytes32ToAddress function for testing
contract TestableIFOPriceReceiver is IFOPriceReceiver {
    constructor(address wormholeRelayerAddr, address ownerAddr) IFOPriceReceiver(wormholeRelayerAddr, ownerAddr) {}

    // Public wrapper to test the internal bytes32ToAddress function
    function testBytes32ToAddress(bytes32 b) public pure returns (address) {
        return bytes32ToAddress(b);
    }
}

contract IFOPriceReceiverTest is Test {
    TestableIFOPriceReceiver receiver;
    address owner = address(0xABCD);
    address nonOwner = address(0xDCBA);
    uint16 sourceChain = 1001;
    bytes32 sourceAddress = bytes32(uint256(0xABCDEF));
    address wormholeRelayer = address(0x5678);

    function setUp() public {
        vm.startPrank(owner);
        receiver = new TestableIFOPriceReceiver(wormholeRelayer, owner);
        vm.stopPrank();
    }

    function testSetRegisteredSenderAsOwner() public {
        vm.startPrank(owner);
        receiver.setRegisteredSender(sourceChain, sourceAddress);
        bytes32 registered = receiver.registeredSenders(sourceChain);
        assertEq(registered, sourceAddress, "Sender not registered correctly");
        vm.stopPrank();
    }

    function testSetRegisteredSenderAsNonOwner() public {
        vm.startPrank(nonOwner);
        vm.expectRevert("Ownable: caller is not the owner");
        receiver.setRegisteredSender(sourceChain, sourceAddress);
        vm.stopPrank();
    }

    function testBytes32ToAddressConversion() public {
        bytes32 input = bytes32(uint256(0xABCDEF));
        address expected = address(uint160(uint256(input)));
        address result = receiver.testBytes32ToAddress(input);
        assertEq(result, expected, "bytes32ToAddress did not convert correctly");
    }

    function testBytes32ToAddressZero() public {
        bytes32 input = bytes32(0);
        address expected = address(0);
        address result = receiver.testBytes32ToAddress(input);
        assertEq(result, expected, "bytes32ToAddress did not handle zero correctly");
    }

    function testBytes32ToAddressMax() public {
        bytes32 input = bytes32(type(uint256).max);
        address expected = address(uint160(uint256(input)));
        address result = receiver.testBytes32ToAddress(input);
        assertEq(result, expected, "bytes32ToAddress did not handle max value correctly");
    }
}
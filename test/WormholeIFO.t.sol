// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import "../src/wormhole/DestinationChainContracts/WormholeIFO.sol";
import "../src/wormhole/DestinationChainContracts/DestinationChainFactory.sol";
import "../lib/wormhole-solidity-sdk/src/testing/WormholeRelayer/MockOffchainRelayer.sol";
import "../test/Mocks/MockIFOPriceReceiver.sol"; // Adjust the path as necessary
import "../lib/forge-std/src/console.sol";

contract WormholeIFOTest is Test {
    WormholeIFO wormholeIFO;
    DestinationChainFactory factory;
    MockOffchainRelayer mockRelayer;
    MockIFOPriceReceiver mockPriceReceiver;

    address owner = address(0xABCD);
    address nonOwner = address(0xDCBA);
    address newDestinationFactory = address(0x1234);
    address initialWormholeRelayer = address(0x5678);

    // Mock addresses and parameters for testing
    uint16 targetChain = 1001;
    address targetAddress = address(0xBEEF);
    uint256 amount = 10;
    address miniNFTAddress = address(0xCAFE);
    address user = address(0xFACE);

    uint256 forkId;

    function setUp() public {
        forkId = vm.createFork("https://arb-sepolia.g.alchemy.com/v2/YW4THm0GBtkHu5w_a4encLrqervum3Xf");
        vm.selectFork(forkId);

        // Start impersonating the owner
        vm.startPrank(owner);

        // Deploy DestinationChainFactory
        factory = new DestinationChainFactory(initialWormholeRelayer);

        // Deploy WormholeIFO with initial Wormhole Relayer and factory
        wormholeIFO = new WormholeIFO(initialWormholeRelayer, address(factory));

        // Deploy MockOffchainRelayer
        mockRelayer = new MockOffchainRelayer();
        wormholeIFO.setWormholeRelayer(address(mockRelayer));

        // Register chains with the mock relayer
        mockRelayer.registerChain(
            targetChain, // Chain ID
            IWormhole(address(0)), // Mock Wormhole contract
            IMessageTransmitter(address(0)), // Mock Message Transmitter
            IWormholeRelayer(address(mockRelayer)), // Relayer address
            forkId // Current fork
        );

        // Deploy and set MockIFOPriceReceiver
        mockPriceReceiver = new MockIFOPriceReceiver();
        wormholeIFO.setIFOPriceQuoter(address(mockPriceReceiver));

        // Register the sender in WormholeIFO
        wormholeIFO.setRegisteredSender(targetChain, keccak256(abi.encodePacked(address(mockRelayer))));

        // Set mock blind box price using MockIFOPriceReceiver
        mockPriceReceiver.setPrice(miniNFTAddress, 1 ether);

        console.log("Setup complete: Fork ID %s", forkId);

        vm.stopPrank();
    }

    function testSetDestinationFactoryAsOwner() public {
        vm.startPrank(owner);
        wormholeIFO.setDestinationFactory(newDestinationFactory);
        assertEq(address(wormholeIFO.destinationChainFactory()), newDestinationFactory, "DestinationFactory not set correctly");
        vm.stopPrank();
    }

    function testSetDestinationFactoryAsNonOwner() public {
        vm.startPrank(nonOwner);
        vm.expectRevert("Ownable: caller is not the owner");
        wormholeIFO.setDestinationFactory(newDestinationFactory);
        vm.stopPrank();
    }

    function testWormholeInteraction() public {
        vm.startPrank(owner);

        console.log("Starting Test Wormhole Interaction");

        // Set mock price (cost)
        address mockIFOPriceQuoter = address(mockPriceReceiver);
        uint256 mockPrice = 1 ether;

        // Start recording logs to capture the Wormhole Relayer's logs
        vm.recordLogs();

        console.log("Sending message via WormholeIFO.sendMessage");

        // Since blindBoxPrice is 1 ether and mockPrice (cost) is 1 ether, total msg.value should be >= 2 ether
        wormholeIFO.sendMessage{value: 2 ether}(
            targetChain,
            targetAddress,
            amount,
            miniNFTAddress,
            user
        );
        console.log("sendMessage executed successfully");
        // Retrieve the recorded logs
        Vm.Log[] memory logs = vm.getRecordedLogs();
        console.log("Logs recorded: %s", logs.length);

        // Relay the captured logs through the MockOffchainRelayer
        mockRelayer.relay(logs, false);
        console.log("Logs relayed through MockOffchainRelayer");

        // Verify that the userBlindBoxAmount has been updated
        uint256 userAmount = wormholeIFO.userBlindBoxAmount(miniNFTAddress, user);
        console.log("User blind box amount: %s", userAmount);
        assertEq(userAmount, amount, "User blind box amount not updated correctly");

        // Verify that isSaleOpen has been updated
        bool saleStatus = wormholeIFO.isSaleOpen(miniNFTAddress);
        console.log("Sale status isOpen: %s", saleStatus);
        assertTrue(saleStatus, "Sale status was not updated correctly");

        vm.stopPrank();
    }
}
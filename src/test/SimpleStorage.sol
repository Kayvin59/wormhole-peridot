//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'wormhole-solidity-sdk/interfaces/IWormholeReceiver.sol';
import 'wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol';

contract SimpleStorage is IWormholeReceiver {
    IWormholeRelayer public wormholeRelayer;
    uint256 public value = 0;
    uint256 public GAS_LIMIT = 1_000_000;
    mapping(uint16 => bytes32) public registeredSenders;
    mapping(bytes32 => address) public registeredAddress;
    bool public messageDelivered = false;

    struct Message {
        bool _messageDelivered;
        uint256 _value;
    }


    modifier isRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) {
        require(registeredSenders[sourceChain] == sourceAddress, "MessageSender: Sender not registered");
        _;
    }

    constructor(address _wormholeRelayer) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
    }

    function quoteCrossChainCost(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );
    }
    
    function sendMessage(
        uint16 targetChain,
        address targetAddress,
        bool _messageDelivered,
        uint256 _value	
    ) public payable {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

        bytes memory payload = abi.encode(_messageDelivered, _value);

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            payload,
            0,
            GAS_LIMIT
        );

    }

    function setRegisteredSender(
        uint16 sourceChain,
        bytes32 sourceAddress
    ) public {
        registeredSenders[sourceChain] = sourceAddress;
        registeredAddress[sourceAddress] = address(bytes20(sourceAddress));
    }

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32
    ) public payable override isRegisteredSender(sourceChain, sourceAddress) {
        require(
            msg.sender == address(wormholeRelayer),
            "Only the Wormhole relayer can call this function"  
        );

        (bool _messageDelivered, uint256 _value) = abi.decode(payload, (bool, uint256));

        value = _value;
        messageDelivered = _messageDelivered;
        
    }

    function withdrawEth() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}

}
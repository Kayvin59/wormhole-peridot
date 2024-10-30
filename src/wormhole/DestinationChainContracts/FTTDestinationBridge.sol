// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol";
import "wormhole-solidity-sdk/interfaces/IWormholeReceiver.sol";
import "../../interface/IPeridotFFT.sol";
import "../interface/IDestinationChainFactory.sol";

contract FTTDestinationBridge is IWormholeReceiver, Ownable {
    IWormholeRelayer public wormholeRelayer;
    IDestinationChainFactory public destinationFactory;

    uint256 constant GAS_LIMIT = 100000;

    mapping(address => uint256) public fftAmount;

    mapping(address => address) public sourceChainFTT;

    mapping(uint16 => bytes32) public registeredSenders;

    event MessageReceived(uint256 amount);
    event SourceChainFTTAdded(address sourceFttContract, address destinationFttContract);
    event BridgeUpdated(address newBridge);
    event TokensBurned(address indexed user, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);

    struct Message {
        address fttContract;
        uint256 amount;
        address to;
    }

    modifier isRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) {
        require(
            registeredSenders[sourceChain] == sourceAddress,
            "Not registered sender"
        );
        _;
    }

    constructor(address _wormholeRelayer, address _destinationFactory) Ownable() {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        destinationFactory = IDestinationChainFactory(_destinationFactory);
    }

    /**
     * @notice Sets the authorized DestinationChainFactory address.
     * @param _destinationFactory The address of the DestinationChainFactory contract.
     */
    function setDestinationFactory(address _destinationFactory) external onlyOwner {
        require(_destinationFactory != address(0), "FTTDestinationBridge: Invalid factory address");
        destinationFactory = IDestinationChainFactory(_destinationFactory);
        emit BridgeUpdated(_destinationFactory);
    }

    /**
    * @notice Adds or updates the mapping from source chain ID and source FTT contract to destination FTT contract.    * @param sourceFttContract The address of the FTT contract on the source blockchain.
    * @param destinationFttContract The address of the corresponding FTT contract on the destination blockchain.
    */
   function addSourceChainFTT(
       address sourceFttContract,
       address destinationFttContract
   ) external onlyOwner {
       require(sourceFttContract != address(0), "Invalid source FTT address");
       require(destinationFttContract != address(0), "Invalid destination FTT address");

       sourceChainFTT[sourceFttContract] = destinationFttContract;

       emit SourceChainFTTAdded(sourceFttContract, destinationFttContract);
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

    /**
     * @notice Registers a sender as authorized to send messages from a specific source chain.
     * @param sourceChain The ID of the source blockchain.
     * @param sourceAddress The Wormhole address of the sender on the source chain.
     */
    function registerSender(uint16 sourceChain, bytes32 sourceAddress) external onlyOwner {
        require(sourceChain != 0, "FTTDestinationBridge: Invalid source chain ID");
        require(sourceAddress != bytes32(0), "FTTDestinationBridge: Invalid source address");
        registeredSenders[sourceChain] = sourceAddress;
    }

    /**
     * @notice Unregisters a sender for a specific source chain.
     * @param sourceChain The ID of the source blockchain.
     */
    function unregisterSender(uint16 sourceChain) external onlyOwner {
        require(sourceChain != 0, "FTTDestinationBridge: Invalid source chain ID");
        registeredSenders[sourceChain] = bytes32(0);
    }

    function sendMessage(
        uint16 targetChain,
        address targetAddress,
        address fttContract,
        uint256 amount,
        address to
    ) public payable {
        require(fttContract != address(0), "FTTDestinationBridge: Invalid FTT contract address");
        require(to != address(0), "FTTDestinationBridge: Invalid recipient address");
        require(amount > 0, "FTTDestinationBridge: Amount must be greater than zero");

        IERC20 token = IERC20(fttContract);
        require(token.transferFrom(msg.sender, address(this), amount), "FTTDestinationBridge: Token transfer failed");

        emit TokensBurned(msg.sender, amount);

        uint256 cost = quoteCrossChainCost(targetChain);
        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

        fftAmount[fttContract] += amount;
        sourceChainFTT[fttContract] = fttContract;

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(Message(fttContract, amount, to)),
            0,
            GAS_LIMIT
        );
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

        // Decode the payload to extract the message
        Message memory message = abi.decode(payload, (Message));

        require(message.fttContract != address(0), "FTTDestinationBridge: Invalid FTT contract address");
        require(message.to != address(0), "FTTDestinationBridge: Invalid recipient address");
        require(message.amount > 0, "FTTDestinationBridge: Amount must be greater than zero");

        address wrappedFFT = sourceChainFTT[message.fttContract];
        require(wrappedFFT != address(0), "FTTDestinationBridge: WrappedFFT does not exist");

        destinationFactory.mintWrappedFFT(message.fttContract, message.to, message.amount);

        emit MessageReceived(message.amount);
    }

    receive() external payable {}
}

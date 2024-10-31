// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol";
import "wormhole-solidity-sdk/interfaces/IWormholeReceiver.sol";
import "../../interface/IPeridotFFT.sol";
import "../../interface/IPeridotSwap.sol";

contract FTTSourceBridge is IWormholeReceiver, Ownable {
    IWormholeRelayer public wormholeRelayer;
    IPeridotSwap public peridotSwap;

    uint256 constant GAS_LIMIT = 100000;

    mapping(address => uint256) public miniNFTAmount;
    mapping(address => uint256) public fftAmount;

    mapping(uint16 => mapping(address => address)) public destinationChainFTT;

    mapping(uint16 => bytes32) public registeredSenders;

    event MessageReceived(uint256 amount);
    event TokensLocked(address indexed user, uint256 amount);
    event TokensUnlocked(address indexed user, uint256 amount);
    event CrossChainTransferInitiated(uint16 indexed targetChain, address indexed user, uint256 amount);

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

    constructor(address _wormholeRelayer, address _peridotSwap) Ownable() {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        peridotSwap = IPeridotSwap(_peridotSwap);
    }

    /**
     * @notice Registers a sender as authorized to send messages from a specific source chain.
     * @param sourceChain The ID of the source blockchain.
     * @param sourceAddress The Wormhole address of the sender on the source chain.
     */
    function registerSender(uint16 sourceChain, bytes32 sourceAddress) external onlyOwner {
        require(sourceChain != 0, "FTTSourceBridge: Invalid source chain ID");
        require(sourceAddress != bytes32(0), "FTTSourceBridge: Invalid source address");
        registeredSenders[sourceChain] = sourceAddress;
    }

    /**
     * @notice Unregisters a sender for a specific source chain.
     * @param sourceChain The ID of the source blockchain.
     */
    function unregisterSender(uint16 sourceChain) external onlyOwner {
        require(sourceChain != 0, "FTTSourceBridge: Invalid source chain ID");
        registeredSenders[sourceChain] = bytes32(0);
    }

    function miniNFTtoFTT(address miniNFTContract, uint256 tokenID, uint256 amount) external onlyOwner returns (bool) {
        require(miniNFTAmount[miniNFTContract] >= amount, "Insufficient balance");

        miniNFTAmount[miniNFTContract] -= amount;
        fftAmount[miniNFTContract] += amount;

        IPeridotSwap(peridotSwap).swapMiniNFTtoFFT(miniNFTContract, tokenID, amount);
        return true;
    }

    /**
     * @notice Retrieves the cost to send a Wormhole message to a target chain.
     * @param targetChain The ID of the target blockchain.
     * @return cost The estimated gas cost for the cross-chain message.
     */
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
     * @notice Sends a Wormhole message to the FTTDestinationBridge contract.
     * @param targetChain The ID of the target blockchain.
     * @param targetAddress The address of the FTTDestinationBridge contract.
     * @param fttContract The address of the FTT contract.
     * @param amount The amount of FTT tokens to send.
     * @param to The address to receive the FTT tokens.
     */
    function sendMessage(
        uint16 targetChain,
        address targetAddress,
        address fttContract,
        uint256 amount,
        address to
    ) public payable {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

        require(amount > 0, "FTTSourceBridge: Amount must be greater than zero");
        require(to != address(0), "FTTSourceBridge: Invalid recipient address");

        bytes memory payload = abi.encode(fttContract, amount, to);

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            payload,
            0,
            GAS_LIMIT
        );
    } 

    /**
     * @notice Handles incoming Wormhole messages from the FTTDestinationBridge contract.
     * @param payload The payload of the Wormhole message.
     * @param sourceAddress The address of the sender on the source chain.
     * @param sourceChain The chain ID of the source chain.
     */
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32
    ) public payable isRegisteredSender(sourceChain, sourceAddress) {
        require(
            msg.sender == address(wormholeRelayer),
            "Only the Wormhole relayer can call this function"
        );

        (address fttContract, uint256 amount, address to) = abi.decode(payload, (address, uint256, address));

        require(amount > fftAmount[fttContract], "FTTSourceBridge: Amount must be greater than fftAmount");

        IERC20 token = IERC20(fttContract);

        require(token.balanceOf(address(this)) >= amount, "Insufficient ERC20 balance");

        // Transfer the ERC20 tokens to the recipient
        bool success = token.transfer(to, amount);
        require(success, "ERC20 transfer failed");

        emit MessageReceived(amount);
    }
}

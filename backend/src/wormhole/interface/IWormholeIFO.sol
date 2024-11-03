// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Import necessary interfaces
import "../interface/IDestinationChainFactory.sol";
import "../interface/IIFOPriceQuoter.sol";
import "wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol";

interface IWormholeIFO {
    // Events
    event MessageReceived(address indexed sender, uint256 amount);
    event TokensMinted(address indexed user, uint256 amount);

    // Public Variables (Getter Functions)
    function destinationChainFactory() external view returns (IDestinationChainFactory);
    function wormholeRelayer() external view returns (IWormholeRelayer);
    function isSaleOpen(address miniNFTAddress) external view returns (bool);
    function blindBoxPrice(address miniNFTAddress) external view returns (uint256);
    function userBlindBoxAmount(address miniNFTAddress, address user) external view returns (uint256);
    function registeredSenders(uint16 sourceChain) external view returns (bytes32);
    function miniNFTToFTT(address miniNFTAddress) external view returns (address);

    // External Functions
    function setDestinationFactory(address _destinationFactory) external;

    function setMiniNFTToFTT(address miniNFT, address fttContract) external;

    function getCurrentBlindBoxPrice(address miniNFTAddress) external returns (uint256);

    function setRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) external;

    function quoteCrossChainCost(uint16 targetChain) external view returns (uint256);

    function setIFOPriceQuoter(address _newIFOPriceQuoter) external;

    function setWormholeRelayer(address _newWormholeRelayer) external;

    function claimWrappedFTT(address miniNFTAddress) external;

    function sendMessage(
        uint16 targetChain,
        address targetAddress,
        uint256 amount,
        address miniNFTAddress,
        address user
    ) external payable;

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory additionalData,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 someOtherData
    ) external payable;
}
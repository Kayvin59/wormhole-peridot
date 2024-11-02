// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "wormhole-solidity-sdk/interfaces/IWormholeReceiver.sol";
import "wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol";
import "../../interface/IPeridotFFT.sol";
import "./WrappedFTT.sol";

contract DestinationChainFactory is IWormholeReceiver, Ownable {
    IWormholeRelayer public wormholeRelayer;

    uint256 constant GAS_LIMIT = 2000000;

    mapping(address => address) public sourceChainFTT;

    mapping(address => bool) public authorizedBridges;

    mapping(uint16 => bytes32) public registeredSenders;

    event WrappedFFTCreated(
        uint16 indexed sourceChainID,
        address indexed sourceFFT,
        address indexed wrappedFFT
    );

    event BridgeAuthorized(address indexed bridge);
    event BridgeRevoked(address indexed bridge);

    modifier isRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) {
        require(
            registeredSenders[sourceChain] == sourceAddress,
            "DestinationChainFactory: Not registered sender"
        );
        _;
    }

    modifier onlyAuthorizedBridge() {
        require(
            authorizedBridges[msg.sender],
            "DestinationChainFactory: Caller is not an authorized bridge"
        );
        _;
    }

    constructor(address _wormholeRelayer) Ownable() {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
    }

    /**
     * @notice Authorizes a bridge to mint WrappedFFT tokens.
     * @param bridge The address of the bridge to authorize.
     */
    function authorizeBridge(address bridge) external onlyOwner {
        require(bridge != address(0), "DestinationChainFactory: Bridge address cannot be zero");
        authorizedBridges[bridge] = true;
        emit BridgeAuthorized(bridge);
    }

    /**
     * @notice Revokes authorization of a bridge.
     * @param bridge The address of the bridge to revoke.
     */
    function revokeBridge(address bridge) external onlyOwner {
        require(authorizedBridges[bridge], "DestinationChainFactory: Bridge is not authorized");
        authorizedBridges[bridge] = false;
        emit BridgeRevoked(bridge);
    }

    /**
     * @notice Sets the Wormhole Relayer address.
     * @param _wormholeRelayer The address of the Wormhole Relayer contract.
     */
    function setWormholeRelayer(address _wormholeRelayer) external onlyOwner {
        require(_wormholeRelayer != address(0), "DestinationChainFactory: Invalid relayer address");
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
    }

    /**
     * @notice Registers a sender as authorized to send messages from a specific source chain.
     * @param sourceChain The ID of the source blockchain.
     * @param sourceAddress The Wormhole address of the sender on the source chain.
     */
    function registerSender(uint16 sourceChain, bytes32 sourceAddress) external onlyOwner {
        require(sourceChain != 0, "DestinationChainFactory: Invalid source chain ID");
        require(sourceAddress != bytes32(0), "DestinationChainFactory: Invalid source address");
        registeredSenders[sourceChain] = sourceAddress;
    }

    /**
     * @notice Unregisters a sender for a specific source chain.
     * @param sourceChain The ID of the source blockchain.
     */
    function unregisterSender(uint16 sourceChain) external onlyOwner {
        require(sourceChain != 0, "DestinationChainFactory: Invalid source chain ID");
        registeredSenders[sourceChain] = bytes32(0);
    }

    /**
     * @notice Handles incoming Wormhole messages to create WrappedFFT tokens.
     * @param payload The encoded message payload.
     * @param sourceAddress The address of the sender on the source chain.
     * @param sourceChain The ID of the source blockchain.
     */
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 
    ) public payable override isRegisteredSender(sourceChain, sourceAddress) {
        require(
            msg.sender == address(wormholeRelayer),
            "DestinationChainFactory: Only the Wormhole relayer can call this function"
        );

        (address sourceFFT, string memory name, string memory symbol) = abi.decode(payload, (address, string, string));

        /*require(
            sourceChainFTT[sourceFFT] == address(0),
            "DestinationChainFactory: WrappedFFT already exists"
        );*/

        // Deploy the WrappedFFT token
        address wrappedFFT = _deployWrappedFFT(name, symbol);

        // Map the sourceChainID and sourceFFT to the WrappedFFT address
        sourceChainFTT[sourceFFT] = wrappedFFT;

        emit WrappedFFTCreated(sourceChain, sourceFFT, wrappedFFT);
    }

    /**
     * @dev Internal function to deploy a WrappedFFT token.
     * @param name The name of the WrappedFFT token.
     * @param symbol The symbol of the WrappedFFT token.
     * @return wrappedFFT The address of the deployed WrappedFFT token.
     */
    function _deployWrappedFFT(string memory name, string memory symbol) internal returns (address wrappedFFT) {
        // Deploy a new ERC20 token with minting capabilities
        WrappedFFT newWrappedFFT = new WrappedFFT(name, symbol, address(this));
        wrappedFFT = address(newWrappedFFT);
    }

    /**
     * @notice Mints WrappedFFT tokens to a specified address.
     * @param sourceFFT The address of the source FFT contract.
     * @param to The address to mint tokens to.
     * @param amount The amount of tokens to mint.
     */
    function mintWrappedFFT(address sourceFFT, address to, uint256 amount) external onlyAuthorizedBridge {
        address wrappedFFT = sourceChainFTT[sourceFFT];
        require(wrappedFFT != address(0), "DestinationChainFactory: WrappedFFT does not exist");

        WrappedFFT(wrappedFFT).mint(to, amount);
    }

    /**
     * @notice Allows the factory to receive Ether for paying Wormhole fees.
     */
    receive() external payable {}
}

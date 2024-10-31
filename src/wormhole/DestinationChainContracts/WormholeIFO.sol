// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol";
import "wormhole-solidity-sdk/interfaces/IWormholeReceiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../../interface/IPeridotMiniNFT.sol";
import "../interface/IIFOPriceQuoter.sol";
import "../interface/IDestinationChainFactory.sol";

contract WormholeIFO is Ownable, IWormholeReceiver, ReentrancyGuard {
    IDestinationChainFactory public destinationChainFactory;
    IIFOPriceQuoter public IFOPriceQuoter;
    IWormholeRelayer public wormholeRelayer;
    uint256 constant GAS_LIMIT = 100000;

    mapping(address => bool) public isSaleOpen;
    mapping(address => uint256) public blindBoxPrice;
    mapping(address => mapping(address => uint256)) public userBlindBoxAmount;
    mapping(uint16 => bytes32) public registeredSenders;
    mapping(address => address) public miniNFTToFTT;

    event MessageReceived(address indexed sender, uint256 amount);
    event TokensMinted(address indexed user, uint256 amount);

    modifier isRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) {
        require(registeredSenders[sourceChain] == sourceAddress, "MessageSender: Sender not registered");
        _;
    }

    /**
     * @notice Constructor to initialize the Wormhole Relayer and IIFO Price Quoter.
     * @param _wormholeRelayer The address of the Wormhole Relayer contract.
     */
    constructor(address _wormholeRelayer, address _destinationChainFactory) Ownable() {
        require(_wormholeRelayer != address(0), "Invalid Wormhole Relayer address");
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        destinationChainFactory = IDestinationChainFactory(_destinationChainFactory);
    }

    /**
     * @notice Sets the DestinationChainFactory address.
     * @param _destinationFactory The address of the DestinationChainFactory contract.
     */
    function setDestinationFactory(address _destinationFactory) external onlyOwner {
        require(_destinationFactory != address(0), "Invalid DestinationChainFactory address");
        destinationChainFactory = IDestinationChainFactory(_destinationFactory);
    }

    function setMiniNFTToFTT(address miniNFT, address fttContract) external onlyOwner {
        require(miniNFT != address(0), "Invalid MiniNFT address");
        require(fttContract != address(0), "Invalid FTT contract address");
        miniNFTToFTT[miniNFT] = fttContract;
    }

    /**
     * @notice Retrieves the current blind box price for a given MiniNFT address.
     * @param miniNFTAddress The address of the MiniNFT contract.
     * @return The current price of the blind box.
     */
    function getCurrentBlindBoxPrice(address miniNFTAddress) public returns (uint256) {
        blindBoxPrice[miniNFTAddress] = IFOPriceQuoter.getQuote(miniNFTAddress);
        return IFOPriceQuoter.getQuote(miniNFTAddress);
    }

    function setRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) external onlyOwner {
        registeredSenders[sourceChain] = sourceAddress;
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

    function setIFOPriceQuoter(address _newIFOPriceQuoter) external onlyOwner {
         require(_newIFOPriceQuoter != address(0), "Invalid IIFO Price Quoter address");
         IFOPriceQuoter = IIFOPriceQuoter(_newIFOPriceQuoter);
    }

    function setWormholeRelayer(address _newWormholeRelayer) external onlyOwner {
        require(_newWormholeRelayer != address(0), "Invalid Wormhole Relayer address");
        wormholeRelayer = IWormholeRelayer(_newWormholeRelayer);
    }

       /**
    * @notice Allows users to claim their WrappedFFT tokens after the sale is closed.
    * @param miniNFTAddress The address of the MiniNFT contract.
    */
   function claimWrappedFTT(address miniNFTAddress) external nonReentrant {
       require(!isSaleOpen[miniNFTAddress], "Sale is still open for this MiniNFT");
       require(userBlindBoxAmount[miniNFTAddress][msg.sender] > 0, "No blind boxes to claim");

       uint256 userAmount = userBlindBoxAmount[miniNFTAddress][msg.sender];
       uint256 mintAmount = userAmount * 1000;

       address fttContract = miniNFTToFTT[miniNFTAddress];
       require(fttContract != address(0), "FTTIIFO: FTT contract not set for this MiniNFT");

       // Interact with DestinationChainFactory to mint WrappedFFT tokens
       destinationChainFactory.mintWrappedFFT(fttContract, msg.sender, mintAmount);

       // Reset the user's blind box amount
       userBlindBoxAmount[miniNFTAddress][msg.sender] = 0;

       emit TokensMinted(msg.sender, mintAmount);
   }

    /**
     * @notice Sends a Wormhole message to the MiniNFT contract.
     * @param targetChain The chain ID of the target chain.
     * @param targetAddress The address of the target contract on the target chain.
     * @param amount The amount of tokens to send.
     * @param miniNFTAddress The address of the MiniNFT contract.
     * @param user The address of the user sending the message.
     */
    function sendMessage(
        uint16 targetChain,
        address targetAddress,
        uint256 amount,
        address miniNFTAddress,
        address user
    ) external payable nonReentrant {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(blindBoxPrice[miniNFTAddress] > 0, "Blind box price not set");

        require(
            msg.value >= cost + blindBoxPrice[miniNFTAddress],
            "Insufficient funds for cross-chain delivery"
        );

        bytes memory payload = abi.encode(amount);

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            payload,
            0,
            GAS_LIMIT
        );

        userBlindBoxAmount[miniNFTAddress][user] += amount;
    }

    /**
     * @notice Handles incoming Wormhole messages from the MiniNFT contract.
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
    ) public payable override isRegisteredSender(sourceChain, sourceAddress) {
        require(
            msg.sender == address(wormholeRelayer),
            "Only the Wormhole relayer can call this function"
        );

        (bool _isSaleOpen, address miniNFTAddress) = abi.decode(payload, (bool, address));

        isSaleOpen[miniNFTAddress] = _isSaleOpen;
    }

    receive() external payable {}
}

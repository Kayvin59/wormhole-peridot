//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import 'wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "../../interface/IPeridotMiniNFT.sol";

contract IFOPriceReceiver1 is Ownable {
    IPeridotMiniNFT public miniNFT;
    IWormholeRelayer public wormholeRelayer;

    address public factory;

    uint256 public currentBlindBoxPrice;

    uint256 constant GAS_LIMIT = 100000;

    mapping(uint16 => bytes32) public registeredSenders;
    mapping(address => uint256) public blindBoxPrice;
    mapping(address => bool) public isMiniNFT;

    struct Price {
        address miniNFT;
        uint256 price;
    }

    event MessageReceived(string message);

    modifier onlyMiniNFT() {
        require(
            isMiniNFT[msg.sender],
            "Not miniNFT"
        );
        _;
    }

    modifier onlyFactory() {
        require(
            msg.sender == factory,
            "Not factory"
        );
        _;
    }

    constructor(address _wormholeRelayer, address _factory) Ownable() {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        factory = _factory;
    }

    function getPrice(address miniNFTAddress) public onlyMiniNFT returns (uint256) {
        uint256 price = IPeridotMiniNFT(miniNFTAddress).getPrice();
        blindBoxPrice[miniNFTAddress] = price;
        return price;
    }

    function setMiniNFT(address miniNFTAddress, bool _isMiniNFT) public onlyFactory {
        isMiniNFT[miniNFTAddress] = _isMiniNFT;
    }

    function setRegisteredSender(
        uint16 sourceChain,
        bytes32 sourceAddress
    ) public onlyOwner {
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

    function sendMessage(
        uint16 targetChain,
        address targetAddress,
        address miniNFTAddress
    ) public payable onlyOwner {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

        uint256 price = blindBoxPrice[miniNFTAddress];

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(Price(miniNFTAddress, price)),
            0,
            GAS_LIMIT
        );
    }


    function bytes32ToAddress(bytes32 b) internal pure returns (address) {
        return address(uint160(uint256(b)));
    }

    function withdrawETH() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/Create2.sol';
import '../library/PeridotMiniNFTHelper.sol';
import '../library/PeridotFFTHelper.sol';
import '../interface/IPeridotTokenFactory.sol';
import '../interface/IPeridotSwap.sol';
import '../wormhole/interface/IIFOPriceReceiver.sol';
import 'wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol';

contract MockPeridotTokenFactory {
  IIFOPriceReceiver public iFOPriceReceiver;
  IWormholeRelayer public wormholeRelayer;
  address private _owner;
  address private _PeridotGovernor;
  address public PeridotSwap;
  address private _PeridotVault;
  address private _PeridotPFVault; //poolfundingvault
  address public pendingVault;
  address public pendingPFVault;
  address public fttSender;

  uint256 constant GAS_LIMIT = 100000;

  mapping(address => address) public projectToMiniNFT;
  mapping(address => address) public projectToFFT;

  mapping(uint16 => address) public destinationFactories;


  event FFTMessageSent(
    uint16 indexed targetChain,
    address indexed targetAddress,
    address indexed fttContract,
    string name,
    string symbol
  );

  constructor(
    address wormholeRelayer_
  ) {
    _owner = msg.sender;
    wormholeRelayer = IWormholeRelayer(wormholeRelayer_);
  }

  modifier onlyFactoryOwner() {
    require(msg.sender == _owner, 'Peridot: invalid caller');
    _;
  }

  function quoteCrossChainCost(uint16 targetChain) public view returns (uint256 cost) {
    (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );
  }

     /**
    * @dev Internal function to send a Wormhole message to the DestinationChainFactory.
    * @param targetChain The ID of the target blockchain.
    * @param newFFTContract The address of the newly deployed FFT contract.
    * @param name The name of the FFT token.
    * @param symbol The symbol of the FFT token.
    */
   function _sendWormholeMessage(
       uint16 targetChain,
       address newFFTContract,
       string memory name,
       string memory symbol
   ) public payable onlyFactoryOwner {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

       address destinationFactory = destinationFactories[targetChain];
       require(destinationFactory != address(0), "Peridot: DestinationFactory not set for target chain");

       bytes memory payload = abi.encode(newFFTContract, name, symbol);

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            destinationFactory,
            payload,
            0,
            GAS_LIMIT
        );

        emit FFTMessageSent(targetChain, destinationFactory, newFFTContract, name, symbol);
   }

   /**
    * @notice Sets the DestinationChainFactory address for a specific target chain.
    * @param targetChainID The ID of the target blockchain.
    * @param destinationFactory The address of the DestinationChainFactory on the target blockchain.
    */
  function setDestinationFactory(uint16 targetChainID, address destinationFactory) external onlyFactoryOwner {
    require(destinationFactory != address(0), "Peridot: invalid destination factory address");
    destinationFactories[targetChainID] = destinationFactory;
  }

  function withdrawEther() external onlyFactoryOwner() returns (bool) {
    uint256 amount = address(this).balance;
    address dao = msg.sender;
    payable(dao).transfer(amount);
    return true;
  }

  receive() external payable {}
}

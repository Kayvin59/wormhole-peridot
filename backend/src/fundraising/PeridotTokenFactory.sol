// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/Create2.sol';
import '../library/PeridotMiniNFTHelper.sol';
import '../library/PeridotFFTHelper.sol';
import '../interface/IPeridotTokenFactory.sol';
import '../interface/IPeridotSwap.sol';
import '../wormhole/interface/IIFOPriceReceiver.sol';
import 'wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol';

contract PeridotTokenFactory is IPeridotTokenFactory {
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
  
  event CollectionPairCreated(
        address indexed projectAddress,
        address indexed newMiniNFTContract,
        address indexed newFFTContract
  );

  event FFTMessageSent(
    uint16 indexed targetChain,
    address indexed targetAddress,
    address indexed fttContract,
    string name
  );

  constructor(
    address daoAddress,
    address swapAddress,
    address vaultAddress,
    address PFvaultAddress,
    address wormholeRelayer_
  ) {
    _owner = msg.sender;
    _PeridotGovernor = daoAddress;
    _PeridotVault = vaultAddress;
    _PeridotPFVault = PFvaultAddress;
    PeridotSwap = swapAddress;
    wormholeRelayer = IWormholeRelayer(wormholeRelayer_);
    pendingVault = _PeridotVault;
    pendingPFVault = _PeridotPFVault;
  }

  modifier onlyFactoryOwner() {
    require(msg.sender == _owner, 'Peridot: invalid caller');
    _;
  }

  modifier onlyDao() {
    require(msg.sender == _PeridotGovernor, 'Peridot: caller is not dao');
    _;
  }

  function createCollectionPair(
    address projectAddress,
    bytes32 salt,
    string memory miniNFTBaseUri,
    string memory name,
    string memory symbol
  ) external onlyFactoryOwner returns (address, address) {
    require(
      projectToMiniNFT[projectAddress] == address(0) &&
        projectToFFT[projectAddress] == address(0),
      'Already exist.'
    );

    bytes memory miniNFTBytecode = PeridotMiniNFTHelper.getBytecode(miniNFTBaseUri, address(wormholeRelayer));

    address newMiniNFTContract = Create2.deploy(
      0,
      salt,
      miniNFTBytecode
    );

    require(newMiniNFTContract != address(0), 'Peridot: deploy MiniNFT Failed');

    address newFFTContract = Create2.deploy(
      0,
      salt,
      PeridotFFTHelper.getBytecode(name, symbol)
    );

    require(newFFTContract != address(0), 'Peridot: deploy FFT Failed');

    projectToMiniNFT[projectAddress] = newMiniNFTContract;
    projectToFFT[projectAddress] = newFFTContract;

    require(
      IPeridotSwap(PeridotSwap).updatePoolRelation(
        newMiniNFTContract,
        newFFTContract,
        projectAddress
      )
    );

    iFOPriceReceiver.setMiniNFT(newMiniNFTContract, true);

    emit CollectionPairCreated(projectAddress, newMiniNFTContract, newFFTContract);
    return (newMiniNFTContract, newFFTContract);
  }

  function updateDao(address daoAddress) external onlyDao returns (bool) {
    _PeridotGovernor = daoAddress;
    return true;
  }

  function signDaoReq() external onlyFactoryOwner returns (bool) {
    _PeridotVault = pendingVault;
    _PeridotPFVault = pendingPFVault;

    return true;
  }

  function updateVault(address pendingVault_) external onlyDao returns (bool) {
    pendingVault = pendingVault_;
    return true;
  }

  function updatePFVault(address pendingPFVault_)
    external
    onlyDao
    returns (bool)
  {
    pendingPFVault = pendingPFVault_;
    return true;
  }

  function getowner() external view override returns (address) {
    return _owner;
  }

  function getDAOAddress() external view override returns (address) {
    return _PeridotGovernor;
  }

  function getSwapAddress() external view override returns (address) {
    return PeridotSwap;
  }

  function getVaultAddress() external view override returns (address) {
    return _PeridotVault;
  }

  function getPoolFundingVaultAddress()
    external
    view
    override
    returns (address)
  {
    return _PeridotPFVault;
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
    */
   function _sendWormholeMessage(
       uint16 targetChain,
       address newFFTContract,
       string memory name
   ) public payable onlyFactoryOwner {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

       address destinationFactory = destinationFactories[targetChain];
       require(destinationFactory != address(0), "Peridot: DestinationFactory not set for target chain");

       bytes memory payload = abi.encode(newFFTContract, name);

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            destinationFactory,
            payload,
            0,
            GAS_LIMIT
        );

        emit FFTMessageSent(targetChain, destinationFactory, newFFTContract, name);
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

  function setFTTSender(address fttSender_) external onlyFactoryOwner {
    fttSender = fttSender_;
  }

  function setIFOPriceReceiver(address iFOPriceReceiver_) external onlyFactoryOwner {
    iFOPriceReceiver = IIFOPriceReceiver(iFOPriceReceiver_);
  }

  function withdrawEther() external onlyFactoryOwner() returns (bool) {
    uint256 amount = address(this).balance;
    address dao = msg.sender;
    payable(dao).transfer(amount);
    return true;
  }

  receive() external payable {}
}

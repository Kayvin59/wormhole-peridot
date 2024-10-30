// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol';
import 'wormhole-solidity-sdk/interfaces/IWormholeReceiver.sol';
import 'wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol';
import '../interface/IPeridotMiniNFT.sol';
import '../interface/IPeridotTokenFactory.sol';
import '../wormhole/interface/IIFOPriceReceiver.sol';

contract PeridotMiniNFT is ERC1155URIStorage, IPeridotMiniNFT, IWormholeReceiver {
  IWormholeRelayer public wormholeRelayer;

  IIFOPriceReceiver public iFOPriceReceiver;

  using Counters for Counters.Counter;

  string public name = 'Peridot MiniNFT';

  Counters.Counter private _tokenIds; //counter of round. 0 reserves for people's NFT

  bool public saleIsActive; //is open for blindbox mint

  address private _factory; //factory deployer address

  address public fttContract;
  
  address public fttSender;

  uint256 public blindBoxPrice = 1E17; //blindbox price

  uint256 public constant ROUND_CAP = 1000;

  uint256 public constant GAS_LIMIT = 100000;

  mapping(uint256 => bool) public roundSucceed; //is round succeed for users' claiming into people's NFT

  mapping(uint256 => uint256) private _totalAmount;

  mapping(uint16 => bytes32) public registeredSenders;

  event MessageReceived(uint amount);
  event SourceChainLogged(uint16 sourceChain);

  modifier onlyDAO() {
    address dao = IPeridotTokenFactory(_factory).getDAOAddress();
    require(msg.sender == dao, 'Peridot: caller is not Peridot DAO');
    _;
  }

  modifier onlyOwner() {
    address owner = IPeridotTokenFactory(_factory).getowner();
    require(msg.sender == owner, 'Peridot: caller is not the owner');
    _;
  }

  modifier isRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) {
        require(
            registeredSenders[sourceChain] == sourceAddress,
            "Not registered sender"
        );
        _;
    }

  /**
   * @dev Total amount of tokens in with a given id.
   */
  constructor(string memory uri_, address wormholeRelayer_) ERC1155(uri_) {
    wormholeRelayer = IWormholeRelayer(wormholeRelayer_);
    _factory = msg.sender;
  }

  receive() external payable {}

  function setFttContract(address fttContract_) external onlyDAO {
    fttContract = fttContract_;
  }

  function setFttSender(address fttSender_) external onlyDAO {
    fttSender = fttSender_;
  }

  function setIFOPriceReceiver(address iFOPriceReceiver_) external onlyDAO {
    iFOPriceReceiver = IIFOPriceReceiver(iFOPriceReceiver_);
  }

  function startNewRound(uint256 sellingPrice)
    external
    override
    onlyDAO
    returns (bool)
  {
    require(!saleIsActive, 'Peridot: active sale exists');
    _tokenIds.increment();
    saleIsActive = true;
    blindBoxPrice = sellingPrice;
    iFOPriceReceiver.getPrice(address(this));
    emit StartNewRound(block.number, sellingPrice);
    return true;
  }

  function closeRound() external override onlyDAO returns (bool) {
    saleIsActive = false;

    emit CloseRound(block.number);
    return true;
  }

  function mintBlindBox(uint256 amount)
    external
    payable
    override
    returns (uint256)
  {
    uint256 round = _tokenIds.current();
    require(saleIsActive, 'Peridot: sale not active');
    require(
      blindBoxPrice * amount <= msg.value,
      'Peridot: Ether value not enough'
    );
    _totalAmount[round] += amount;
    if (totalSupply(round) >= ROUND_CAP) {
      saleIsActive = false;
    }
    _mint(msg.sender, round, amount, '');
    return amount;
  }

  function claimBlindBox(uint256 tokenID) external override returns (uint256) {
    require(roundSucceed[tokenID], 'Peridot: round is not succeed');

    uint256 amount = balanceOf(msg.sender, tokenID);
    require(amount > 0, 'Peridot: no blindbox to claim');

    _totalAmount[tokenID] -= amount;
    _totalAmount[0] += amount;
    _burn(msg.sender, tokenID, amount);
    _mint(msg.sender, 0, amount, '');

    emit ClaimBlindBox(msg.sender, tokenID, amount);
    return amount;
  }

  // Withdraw fundrasing ethers for purchasing NFT
  function withdrawEther() external override onlyDAO returns (bool) {
    uint256 amount = address(this).balance;
    address dao = msg.sender;
    payable(dao).transfer(amount);

    emit WithdrawEther(msg.sender, amount);
    return true;
  }

  function updateDefaultURI(string memory defaultURI) external onlyOwner {
    _setURI(defaultURI);
  }

  function updateTokenURI(uint256 tokenId, string memory tokenURI)
    external
    onlyOwner
  {
    _setURI(tokenId, tokenURI);
  }

  function updateRoundSucceed(uint256 round)
    external
    override
    onlyDAO
    returns (bool)
  {
    require(_totalAmount[round] >= ROUND_CAP, 'Peridot: Not achieve yet');
    roundSucceed[round] = true;

    crosschainClaim(round);

    emit UpdateRoundSucceed(round, block.number);
    return roundSucceed[round];
  }

  function updateBlindBoxPrice(uint256 newPrice)
    external
    override
    onlyDAO
    returns (bool)
  {
    blindBoxPrice = newPrice;

    emit UpdateBlindBoxPrice(newPrice);
    return true;
  }

  function totalSupply(uint256 id) public view override returns (uint256) {
    return _totalAmount[id];
  }

  function burn(uint256 amount) external {
    _totalAmount[0] -= amount;
    _burn(msg.sender, 0, amount);
  }

  function currentRound() public view returns (uint256) {
    return _tokenIds.current();
  }

  function swapmint(uint256 amount, address to)
    external
    virtual
    override
    returns (bool)
  {
    require(
      msg.sender == IPeridotTokenFactory(_factory).getSwapAddress(),
      'Peridot: caller is not swap'
    );
    _totalAmount[0] += amount;
    _mint(to, 0, amount, '');
    return true;
  }

    function setRegisteredSender(
        uint16 sourceChain,
        bytes32 sourceAddress
    ) public onlyDAO {
        registeredSenders[sourceChain] = sourceAddress;
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
        uint256 amount = abi.decode(payload, (uint256));

        crosschainMint(amount);

        // Emit an event with the received message
        emit MessageReceived(amount);
    }
    
    function crosschainMint(uint256 amount) private {
      uint256 round = _tokenIds.current();
      _totalAmount[round] += amount;

      if (totalSupply(round) >= ROUND_CAP) {
        saleIsActive = false;
      }

      _mint(address(this), round, amount, '');

    }

    function crosschainClaim(uint256 tokenID) private {
      require(roundSucceed[tokenID], 'Peridot: round is not succeed');

      uint256 amount = balanceOf(address(this), tokenID);
      require(amount <= _totalAmount[tokenID], 'Peridot: amount exceeds total amount');

      _totalAmount[tokenID] -= amount;
      _totalAmount[0] += amount;
      _burn(address(this), tokenID, amount);
      _mint(fttSender, 0, amount, '');

      emit ClaimBlindBox(address(this), tokenID, amount);
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
        address targetAddress
    ) external payable onlyDAO {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(saleIsActive, fttContract),
            0,
            GAS_LIMIT
        );

    }

  function getPrice() public view returns (uint256) {
    return blindBoxPrice;
    }

}

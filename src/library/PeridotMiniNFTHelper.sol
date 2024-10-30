// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '../fundraising/PeridotMiniNFT.sol';

library PeridotMiniNFTHelper {
  function getBytecode(string memory baseUri, address wormholeRelayer) internal pure returns (bytes memory) {
    bytes memory bytecode = type(PeridotMiniNFT).creationCode;
    return abi.encodePacked(bytecode, abi.encode(baseUri, wormholeRelayer));
  }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IIFOPriceReceiver {
    function getPrice(address miniNFTAddress) external returns (uint256);

    function setMiniNFT(address miniNFTAddress, bool _isMiniNFT) external;
}

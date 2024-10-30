//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IIFOPriceQuoter {
    function getQuote(address miniNFTAddress) external returns (uint256);
}

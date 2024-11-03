// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../../src/wormhole/interface/IIFOPriceQuoter.sol";

/**
 * @title MockIFOPriceReceiver
 * @dev A mock implementation of the IIFOPriceQuoter interface for testing purposes.
 */
contract MockIFOPriceReceiver is IIFOPriceQuoter {
    // Mapping to store prices for different MiniNFT addresses
    mapping(address => uint256) private _prices;

    /**
     * @notice Sets the price for a specific MiniNFT address.
     * @param miniNFTAddress The address of the MiniNFT.
     * @param price The price to set.
     */
    function setPrice(address miniNFTAddress, uint256 price) external {
        _prices[miniNFTAddress] = price;
    }

    /**
     * @notice Returns the quote for a given MiniNFT address.
     * @param miniNFTAddress The address of the MiniNFT.
     * @return The price of the MiniNFT.
     */
    function getQuote(address miniNFTAddress) external view override returns (uint256) {
        return _prices[miniNFTAddress];
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDestinationChainFactory {
    function mintWrappedFFT(address sourceFFT, address to, uint256 amount) external;
}
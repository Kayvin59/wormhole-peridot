// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WrappedFFT is ERC20 {
    address public factory;

    constructor(string memory name_, string memory symbol_, address factory_) ERC20(name_, symbol_) {
        require(factory_ != address(0), "WrappedFFT: Factory address cannot be zero");
        factory = factory_;
    }

    modifier onlyFactory() {
        require(msg.sender == factory, "WrappedFFT: Only factory can mint");
        _;
    }

    /**
     * @notice Mints new WrappedFFT tokens to a specified address.
     * @param to The address to mint tokens to.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyFactory {
        _mint(to, amount);
    }

    /**
     * @notice Burns WrappedFFT tokens from a specified address.
     * @param from The address to burn tokens from.
     * @param amount The amount of tokens to burn.
     */
    function burn(address from, uint256 amount) external onlyFactory {
        _burn(from, amount);
    }
}
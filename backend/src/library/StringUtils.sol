// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library StringUtils {
    /**
     * @dev Converts a `string` to `bytes32`. Truncates the string if it's longer than 32 bytes.
     * @param source The string to convert.
     * @return result The converted bytes32 value.
     */
    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory temp = bytes(source);
        if (temp.length == 0) {
            return 0x0;
        }

        // Initialize a bytes32 variable with default value
        result = 0x0;

        // Copy each byte from the string to the bytes32 result
        for (uint256 i = 0; i < temp.length && i < 32; i++) {
            result |= bytes32(temp[i] & 0xFF) >> (i * 8);
        }
    }
}
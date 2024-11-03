// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library BytesUtils {
    /**
     * @dev Converts a `bytes32` to a `string`.
     * @param _bytes32 The bytes32 value to convert.
     * @return The converted string.
     */
    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0){
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for(uint8 j = 0; j < i; j++){
            bytesArray[j] = _bytes32[j];
        }
        return string(bytesArray);
    }
}
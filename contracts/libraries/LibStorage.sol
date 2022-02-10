// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibStorage {
    bytes32 constant MAIN_STORAGE_POSITION = keccak256("diamond.standard.main.storage");

    struct MainStorage {
        mapping(uint256 => uint256) priceMap;
    }

    function mainStorage() internal pure returns (MainStorage storage ds) {
        bytes32 position = MAIN_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}

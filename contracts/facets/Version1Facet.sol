// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { LibStorage } from "../libraries/LibStorage.sol";

contract Version1Facet {
    using SafeMath for uint256;

    function setPrice(uint256 timestamp, uint256 price) external {
        uint256 day = timestamp.div(86400);
        LibStorage.MainStorage storage ds = LibStorage.mainStorage();
        ds.priceMap[day] = price;
    }

    function getPrice(uint256 timestamp) external view returns(uint256 price){
        uint256 day = timestamp.div(86400);
        LibStorage.MainStorage storage ds = LibStorage.mainStorage();
        price = ds.priceMap[day];
    }

    function getAvgPrice(uint256 from, uint256 to) external view returns(uint256 avgPrice) {
        require(from < to, "to must be greater than from");
        avgPrice = 0;
        uint256 count = 0;

        uint256 startDay = from.div(86400);
        uint256 toDay = to.div(86400);

        LibStorage.MainStorage storage ds = LibStorage.mainStorage();
        for (uint256 i = startDay; i <= toDay; i ++) {
            uint256 price = ds.priceMap[i];
            if (price > 0) {
                count = count.add(1);
                avgPrice = avgPrice.add(price);
            }
        }

        avgPrice = avgPrice.div(count);
    }

    
}

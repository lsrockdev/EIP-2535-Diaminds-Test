// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { LibStorage } from "../libraries/LibStorage.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

contract Version2Facet {
    using SafeMath for uint256;

    modifier onlyOwner() {
        require(LibDiamond.contractOwner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function setPrice(uint256 timestamp, uint256 price) external onlyOwner{
        uint256 day = timestamp.div(86400);
        LibStorage.MainStorage storage ds = LibStorage.mainStorage();
        ds.priceMap[day] = price;
    }
}

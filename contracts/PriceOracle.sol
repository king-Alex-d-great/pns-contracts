// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract PriceConsumerV3 is Initializable {
	AggregatorV3Interface internal priceFeed;

	/**
	 * Network: Mainnet
	 * Aggregator: ETH/USD
	 * Address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
	 */

	/**
	 * Network: Goreil
	 * Aggregator: ETH/USD
	 * Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e)
	 */
	function initialize() public {
		priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
	}

	/**
	 * Returns the latest price
	 */
	function getLatestETHPrice() internal view returns (int256) {
		(uint80 roundID, int256 price, , uint256 timeStamp, uint80 answeredInRound) = priceFeed.latestRoundData();
		require(answeredInRound >= roundID, 'getEtherPrice: Chainlink Price Stale');
		// If the round is not complete yet, timestamp is 0
		require(timeStamp > 0, 'Round not complete');
		return uint256(price) * (10**8);
	}
}

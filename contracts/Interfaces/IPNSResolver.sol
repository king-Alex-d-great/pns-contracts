// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './IPNSSchema.sol';

/**
 * @title Interface for the PNS Resolver contract.
 * @author PNS foundation core
 * @notice This only serves as a function guide for the PNS Resolver contract.
 * @dev All function call interfaces are defined here.
 */
interface IPNSResolver is IPNSSchema {
	function getOwner(bytes32 phoneHash) external view returns (address);

	function getRecord(bytes32 phoneHash) external view returns (PhoneRecord memory);

	function recordExists(bytes32 phoneHash) external view returns (bool);

	function getResolverDetails(bytes32 phoneHash) external view returns (ResolverRecord[] memory);

	function getVersion() external view returns (uint32 version);
}

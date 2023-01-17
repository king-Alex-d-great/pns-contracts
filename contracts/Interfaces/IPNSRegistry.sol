// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './IPNSSchema.sol';

/**
 * @title Interface for the PNS Registry contract.
 * @author PNS foundation core
 * @notice This only serves as a function guide for the PNS Registry contract.
 * @dev All function call interfaces are defined here.
 */
interface IPNSRegistry is IPNSSchema {
	function setPhoneRecord(
		bytes32 phoneHash,
		address resolver,
		string memory label
	) external payable;

	function linkPhoneToWallet(
		bytes32 phoneHash,
		address resolver,
		string memory label
	) external;

	function setOwner(bytes32 phoneHash, address owner) external;

	function getRecord(bytes32 phoneHash) external view returns (PhoneRecord memory);

	function getResolver(bytes32 phoneHash) external view returns (ResolverRecord[] memory);

	function renew(bytes32 phoneHash) external payable;

	function getAmountinETH(uint256 usdAmount) external view returns (uint256);

	function claimExpiredPhoneRecord(
		bytes32 phoneHash,
		address resolver,
		string memory label
	) external payable;

	function setExpiryTime(uint256 time) external;

	function isRecordVerified(bytes32 phoneHash) external view returns (bool);

	function getExpiryTime() external view returns (uint256);

	function getGracePeriod() external view returns (uint256);

	function setGracePeriod(uint256 time) external;

	function setRegistryCost(uint256 _registryCost) external;

	function setRegistryRenewCost(uint256 _renewalCost) external;

	function getRecordMapping(bytes32 phoneHash) external view returns (PhoneRecord memory);

	function verifyPhone(
		bytes32 phoneHash,
		bytes32 hashedMessage,
		bool status,
		bytes memory signature
	) external;

	function setGuardianAddress(address guardianAddress) external;

	function withdraw(address _recipient, uint256 amount) external;

	function getVersion() external view returns (uint32 version);

	function recordExists(bytes32 phoneHash) external view returns (bool);

	function getVerificationRecord(bytes32 phoneHash) external view returns (VerificationRecord memory);
}

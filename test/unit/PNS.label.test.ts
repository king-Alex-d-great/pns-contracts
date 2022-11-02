import { ethers } from 'hardhat';

const { assert, expect } = require('chai');
const { keccak256 } = require('../../utils/util');
const { deployContract } = require('../../helper-hardhat-config');

describe('PNS Label linking', () => {
  let pnsContract;
  let adminAddress;
  const phoneNumber1 = keccak256('07084462591');
  const phoneNumber2 = keccak256('08084442592');
  const label1 = 'ETH';
  const label2 = 'BTC';
  let resolverCreatedLength = 0;
  const authFee = ethers.utils.parseEther('1');

  before(async function () {
    const { pnsContract: _pnsContract, adminAddress: _adminAddress } = await deployContract();
    pnsContract = _pnsContract;
    adminAddress = _adminAddress;
  });

  // will come back to this

  // it('should throw an error if an unauthorized user tries to add a new resolver', async () => {
  //   await expect(
  //     pnsContract.linkPhoneToWallet(phoneNumber1, adminAddress, label2, {
  //       from: address1,
  //     }),
  //   ).to.be.revertedWith('caller is not authorised');
  // });

  it('should create a new record and emit an event', async function () {
    await expect(
      pnsContract.setPhoneRecord(phoneNumber1, adminAddress, adminAddress, label1, { value: authFee }),
    ).to.emit(pnsContract, 'PhoneRecordCreated');
    resolverCreatedLength++;
  });

  it('should link a new resolver to a phone record and emit an event', async () => {
    await expect(pnsContract.linkPhoneToWallet(phoneNumber1, adminAddress, label2)).to.emit(pnsContract, 'PhoneLinked');
    resolverCreatedLength++;
  });

  it('verifies that all previously created resolvers exists', async () => {
    const resolvers = await pnsContract.getResolverDetails(phoneNumber1);
    const wallets = resolvers.length;

    assert.equal(wallets, resolverCreatedLength);
  });

  it('should throw an error if phone record of a resolver does not exist', async () => {
    await expect(pnsContract.getResolverDetails(phoneNumber2)).to.be.revertedWith('phone record not found');
  });

  it('should get the details of a specific resolver', async () => {
    const resolvers = await pnsContract.getResolverDetails(phoneNumber1);
    const firstLabel = resolvers[0][2];
    const secondLabel = resolvers[1][2];

    assert.equal(firstLabel, label1);
    assert.equal(secondLabel, label2);
  });
});

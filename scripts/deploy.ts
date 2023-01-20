import { ethers, upgrades } from 'hardhat';
import hre from 'hardhat';

import { chainlink_price_feeds } from './constants';

async function deployContract() {
  let adminAccount;
  let pnsRegistryContract;
  let registryCost = '10000000000000000000'; // 10 usd
  let registryRenewCost = '5000000000000000000'; // 5 usd

  console.log(hre.network.name, 'network name');

  [adminAccount] = await ethers.getSigners();
  const adminAddress = adminAccount.address;
  console.log(adminAddress, 'address');

  const PNSRegistryContract = await ethers.getContractFactory('PNSRegistry');

  const PNSResolverContract = await ethers.getContractFactory('PNSResolver');

  const PNSGuardianContract = await ethers.getContractFactory('PNSGuardian');

  const pnsGuardianContract = await upgrades.deployProxy(PNSGuardianContract, [adminAddress], {
    initializer: 'initialize',
  });
  await pnsGuardianContract.deployed();

  console.log('PNS Guardian Contract Deployed to', pnsGuardianContract.address);

  if (hre.network.name === 'ethereum_mainnet') {
    pnsRegistryContract = await upgrades.deployProxy(
      PNSRegistryContract,
      [pnsGuardianContract.address, chainlink_price_feeds.ETHEREUM_MAINNET, adminAddress],
      {
        initializer: 'initialize',
      },
    );
  } else if (hre.network.name === 'bnb_mainnet') {
    pnsRegistryContract = await upgrades.deployProxy(
      PNSRegistryContract,
      [pnsGuardianContract.address, chainlink_price_feeds.BSC_MAINNET, adminAddress],
      {
        initializer: 'initialize',
      },
    );
  } else if (hre.network.name === 'polygon_mainnet') {
    pnsRegistryContract = await upgrades.deployProxy(
      PNSRegistryContract,
      [pnsGuardianContract.address, chainlink_price_feeds.MATIC_MAINNET, adminAddress],
      {
        initializer: 'initialize',
      },
    );
  } else if (hre.network.name === 'ethereum_goerli') {
    pnsRegistryContract = await upgrades.deployProxy(
      PNSRegistryContract,
      [pnsGuardianContract.address, chainlink_price_feeds.ETHEREUM_GOERLI, adminAddress],
      {
        initializer: 'initialize',
      },
    );
  } else if (hre.network.name === 'bnb_testnet') {
    pnsRegistryContract = await upgrades.deployProxy(
      PNSRegistryContract,
      [pnsGuardianContract.address, chainlink_price_feeds.BSC_TESTNET, adminAddress],
      {
        initializer: 'initialize',
      },
    );
  } else if (hre.network.name === 'polygon_mumbai') {
    pnsRegistryContract = await upgrades.deployProxy(
      PNSRegistryContract,
      [pnsGuardianContract.address, chainlink_price_feeds.MATIC_MUMBAI, adminAddress],
      {
        initializer: 'initialize',
      },
    );
  } else {
    pnsRegistryContract = await upgrades.deployProxy(
      PNSRegistryContract,
      [pnsGuardianContract.address, chainlink_price_feeds.BSC_MAINNET, adminAddress],
      {
        initializer: 'initialize',
      },
    );
  }
  await pnsRegistryContract.deployed();

  console.log('PNS Registry Contract Deployed to', pnsRegistryContract.address);
  await pnsRegistryContract.setRegistryCost(registryCost);
  const pnsRegistrycost = await pnsRegistryContract.getRegistryCost();
  await pnsRegistryContract.setRegistryRenewCost(registryRenewCost);
  const pnsRegistryRenewCost = await pnsRegistryContract.getRegistryRenewCost();
  console.log('Registry Cost set to', pnsRegistrycost, 'Registry Renew Cost set to', pnsRegistryRenewCost);

  const ethPrice = await pnsRegistryContract.getAmountinETH();

  console.log(ethPrice.toString(), 'price in eth');

  await pnsGuardianContract.setPNSRegistry(pnsRegistryContract.address);
  console.log('Registry contract set to', pnsRegistryContract.address);

  const pnsResolverContract = await upgrades.deployProxy(PNSResolverContract, [pnsRegistryContract.address], {
    initializer: 'initialize',
  });
  await pnsResolverContract.deployed();

  console.log('PNS Resolver Contract Deployed to', pnsResolverContract.address);

  return { pnsRegistryContract, adminAddress, pnsResolverContract };
}

async function deployUpgradedContract(pnsRegistryContract) {
  const PNSV2MockContract = await ethers.getContractFactory('PNSV2Mock');

  const upgradedPNSRegistryContract = await upgrades.upgradeProxy(pnsRegistryContract, PNSV2MockContract);

  return { upgradedPNSRegistryContract };
}

module.exports = {
  deployContract,
  deployUpgradedContract,
};

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

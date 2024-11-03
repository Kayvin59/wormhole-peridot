const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Link libraries to PeridotTokenFactory
  const PeridotTokenFactory = await hre.ethers.getContractFactory(
    "PeridotTokenFactory",
    {
      libraries: {
        PeridotFFTHelper: "0x4f74a4B2c5F95360d3282Ec7342bbC91877D74e2",
        PeridotMiniNFTHelper: "0xFd5078F159b451F38E3B0E341770f102eed65A9a",
      },
    }
  );

  // Deploy PeridotTokenFactory with linked libraries
  const daoAddress = "0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9";
  const swapAddress = "0x87595fe09Ded1489878F180fcC31DB21246c5Bc7";
  const vaultAddress = "0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9";
  const PFvaultAddress = "0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9";
  const peridotTokenFactory = await PeridotTokenFactory.deploy(
    daoAddress,
    swapAddress,
    vaultAddress,
    PFvaultAddress
  );

  await peridotTokenFactory.deployed();
  console.log("PeridotTokenFactory deployed to:", peridotTokenFactory.address);
}

/*
npx hardhat verify --libraries scripts/libraries.js 0xA8C145957Fb4034B03954cCe7595944874A34Da1 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9 0x6BC51B9cEf146519C6E39d7505F2080199b4E62D 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9 --network sepolia
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const PeridotSwapProxy = await hre.ethers.getContractFactory(
    "PeridotSwapProxy"
  );
  const peridotSwapProxy = await PeridotSwapProxy.deploy();

  await peridotSwapProxy.deployed();

  console.log("PeridotSwapProxy deployed to:", peridotSwapProxy.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

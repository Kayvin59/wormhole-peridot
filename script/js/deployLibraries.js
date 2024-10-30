const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const PeridotFFTHelper = await hre.ethers.getContractFactory(
    "PeridotFFTHelper"
  );
  const peridotFFTHelper = await PeridotFFTHelper.deploy();

  await peridotFFTHelper.waitForDeployment();

  console.log(
    "PeridotFFTHelper deployed to:",
    await peridotFFTHelper.getAddress()
  );

  const PeridotMiniNFTHelper = await hre.ethers.getContractFactory(
    "PeridotMiniNFTHelper"
  );
  const peridotMiniNFTHelper = await PeridotMiniNFTHelper.deploy();

  await peridotMiniNFTHelper.waitForDeployment();

  console.log(
    "PeridotMiniNFTHelper deployed to:",
    await peridotMiniNFTHelper.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

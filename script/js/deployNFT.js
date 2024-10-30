const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const PeridotMemberNFT = await hre.ethers.getContractFactory(
    "PeridotMemberNFT"
  );
  const peridotMemberNFT = await PeridotMemberNFT.deploy();

  await peridotMemberNFT.waitForDeployment();

  console.log("PeridotMemberNFT deployed to:", await peridotMemberNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

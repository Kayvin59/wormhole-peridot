const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const IFOPriceQuoter = await hre.ethers.getContractFactory("IFOPriceQuoter");
  const iFOPriceQuoter = await IFOPriceQuoter.deploy(
    0xad753479354283eee1b86c9470c84d42f229ff43 // wormholeRelayer
  );

  await iFOPriceQuoter.deployed();

  console.log("IFOPriceQuoter deployed to:", iFOPriceQuoter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

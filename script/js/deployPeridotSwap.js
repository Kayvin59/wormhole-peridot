const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // You need to replace these addresses with the actual addresses you intend to use
  const _witnetRandomness = "0xC0FFEE98AD1434aCbDB894BbB752e138c1006fAB";

  const PeridotSwap = await hre.ethers.getContractFactory("PeridotSwap");
  const peridotSwap = await PeridotSwap.deploy(_witnetRandomness);

  await peridotSwap.deployed();

  console.log("PeridotSwap deployed to:", peridotSwap.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

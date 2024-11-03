const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the PeridotSwap logic contract
  const PeridotSwapV2 = await ethers.getContractFactory("PeridotSwapV2");
  const peridotSwapV2 = await PeridotSwapV2.deploy();
  await peridotSwapV2.deployed();
  console.log("PeridotSwapV2 logic deployed to:", peridotSwapV2.address);

  // Encode the initialization data
  const initData = peridotSwapV2.interface.encodeFunctionData("initialize", [
    "0xC0FFEE98AD1434aCbDB894BbB752e138c1006fAB", // _witnetRandomness
  ]);

  // Deploy the TransparentUpgradeableProxy contract
  const PeridotSwapProxy = await ethers.getContractFactory("PeridotSwapProxy");
  const proxy = await PeridotSwapProxy.deploy(peridotSwapV2.address, initData);
  await proxy.deployed();
  console.log("PeridotSwapProxy deployed to:", proxy.address);
}

/* Proxy Verification:
npx hardhat console --network arbitrumSepolia

const PeridotSwap = await ethers.getContractFactory("PeridotSwapV2");
const initData = PeridotSwap.interface.encodeFunctionData("initialize", [
  "0xC0FFEE98AD1434aCbDB894BbB752e138c1006fAB" // _witnetRandomness
]);

console.log(initData);

npx hardhat verify --network arbitrumSepolia 0xYourProxyAddress 0xYourLogicAddress 0xYourAdminAddress 0xYourEncodedInitData
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Storage = await hre.ethers.getContractFactory("Storage");
  const storage = await Storage.deploy();

  await storage.deployed();

  console.log("Storage deployed to:", storage.address);

  const EIP1967Proxy = await hre.ethers.getContractFactory("EIP1967Proxy");
  const eIP1967Proxy = await EIP1967Proxy.deploy(storage.address);

  await eIP1967Proxy.deployed();

  console.log("EIP1967Proxy deployed to:", eIP1967Proxy.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

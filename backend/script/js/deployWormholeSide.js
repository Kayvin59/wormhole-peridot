const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MessageSender = await hre.ethers.getContractFactory("MessageSender");
  const messageSender = await MessageSender.deploy(
    0x93bad53ddfb6132b0ac8e37f6029163e63372cee // wormholeRelayer base
  );

  await messageSender.deployed();

  console.log("MessageSender deployed to:", messageSender.address);

  const IFOPriceReceiver = await hre.ethers.getContractFactory(
    "IFOPriceReceiver"
  );
  const iFOPriceReceiver = await IFOPriceReceiver.deploy(
    0x93bad53ddfb6132b0ac8e37f6029163e63372cee // wormholeRelayer base
  );

  await iFOPriceReceiver.deployed();

  console.log("IFOPriceReceiver deployed to:", iFOPriceReceiver.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

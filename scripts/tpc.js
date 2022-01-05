const hre = require("hardhat");

async function Main() {
    const Tpc = await hre.ethers.getContractFactory("CommitAuth");
    const tpc = await Tpc.deploy();

    await tpc.deployed();

    console.log("Lib deployed to:", tpc.address);

}

Main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
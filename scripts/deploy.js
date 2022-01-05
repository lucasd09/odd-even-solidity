
const hre = require("hardhat");

async function main() {
  let player1, player2;
  [player1, player2] = await hre.ethers.getSigners();

  const Game = await hre.ethers.getContractFactory("Game", {
    libraries: {
        CommitAuth: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    },
  });
  const game = await Game.deploy(player1.address, player2.address);

  await game.deployed();

  console.log("Game deployed to:", game.address);
}

//pattern usado para poder usar async/await em qualquer lugar e devidamente dar conta de erros
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

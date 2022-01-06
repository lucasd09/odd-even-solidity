const { expect } = require("chai");
const Web3 = require('web3');

describe("Game contract", () => {
    let player1, player2, Game, game, Lib, lib;
  
    const nonce1 = "13396leet51523nbhd345noce";
    const nonce2 = "1339123213126leet686noce";

    beforeEach(async function () {
        [player1, player2] = await hre.ethers.getSigners();

        Lib = await hre.ethers.getContractFactory("CommitAuth");
        lib = await Lib.deploy();
      
        Game = await hre.ethers.getContractFactory("Game", {
          libraries: {
              CommitAuth: lib.address,
          },
        });
        game = await Game.deploy(player1.address, player2.address);
    });

    it("Endereço do jogo", async () => {
        expect(await console.log(game.address))
    })

    it("Endereço do player 1", async () => {
        expect(await console.log(player1.address))
    })

    it("Endereço do player 2", async () => {
        expect(await console.log(player2.address))
    })
    
    it("Jogadores escolhem par ou impar", async () => {
        //jogador 1
        await game.connect(player1).choice(0)
        //jogador2
        await game.connect(player2).choice(1)
        
        expect()
    })

    it("Jogadores fazem as apostas", async () => {
        //jogador 1
        await game.connect(player1).doBet(Web3.utils.toWei('1', 'ether'))
        //jogador 2
        await game.connect(player2).doBet(Web3.utils.toWei('1', 'ether'))
        console.log("valor da aposta: " + (await game.poolBalance()))
        expect(await game.poolBalance())
    })

    it("é possivel dar commit", async () => {
        const hash1 = await game.hashData(nonce1, 20);
        const hash2 = await game.hashData(nonce2, 1);
        
        console.log(hash1, 20);
        console.log(hash2, 1);

        await game.connect(player1).commit(hash1);
        await game.connect(player2).commit(hash2);
        expect()
    })

    it("é revelado os valores", async () => {
        await game.connect(player1).reveal(nonce1, 20);
        await game.connect(player2).reveal(nonce2, 1);

        console.log(await game.getResult())
        expect(await game.getResult() == true)
    })

    it("o jogo é realizado e o ganhador recebe o premio", async () => {
        await game.gameLogic()
    })
})
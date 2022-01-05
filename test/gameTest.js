const { expect } = require("chai");

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
        expect(console.log(game.address))
    })

    it("Endereço do player 1", async () => {
        expect(console.log(player1.address))
    })

    it("Endereço do player 2", async () => {
        expect(console.log(player2.address))
    })
    
    it("Jogadores escolhem par ou impar", async () => {
        //jogador 1
        game.choice(0, player1.address)
        //jogador2
        game.choice(1, player2.address)
    })

    it("Jogadores fazem as apostas", async () => {
        //jogador 1
        game.doBet(100)
        //jogador 2
        game.doBet(400)
        console.log("valor da aposta: " + (await game.poolBalance()))
        expect(await game.poolBalance() == 500)
    })

    it("é possivel dar commit", async () => {
        const hash1 = await game.hashData.call(nonce1, 20);
        const hash2 = await game.hashData.call(nonce2, 1);
        
        console.log(hash1);
        console.log(hash2);

        await game.commit({from: player1.address, value: web3.utils.toWei('1', 'ether')});
        await game.commit({from: player2.address, value: web3.utils.toWei('1', 'ether')});
        expect()
    })
})
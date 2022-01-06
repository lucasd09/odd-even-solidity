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
        game.choice(0, player1.address)
        //jogador2
        game.choice(1, player2.address)
        
        expect()
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
        const hash1 = await game.hashData(nonce1, 20);
        const hash2 = await game.hashData(nonce2, 1);
        
        console.log(hash1, 20);
        console.log(hash2, 1);

        await game.commit(hash1, player1.address);
        await game.commit(hash2, player2.address);
        expect()
    })

    it("é revelado os valores", async () => {
        await game.reveal(nonce1, 20, player1.address);
        await game.reveal(nonce2, 1, player2.address);

        expect(game.getResult() == true)
    })
})
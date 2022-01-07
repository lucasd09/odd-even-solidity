const { expect } = require("chai");

// jogador 1: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// jogador 2: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

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

    it("player 1", async () => {
        expect(await console.log(player1.address))
    })

    it("player 2", async () => {
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
        await game.connect(player1).doBet(ethers.utils.parseEther('1'))
        //jogador 2
        await game.connect(player2).doBet(ethers.utils.parseEther('1'))
        console.log("valor da aposta: " + (await game.poolBalance()))
        expect(await game.poolBalance())
    })

    it("o jogo começa", async () => {
        // par ou impar
        await game.connect(player1).choice(0) //jogador 1
        await game.connect(player2).choice(1) //jogador 2
 
        //apostas
        await game.connect(player1).doBet(ethers.utils.parseEther('1'))//jogador 1
        await game.connect(player2).doBet(ethers.utils.parseEther('1')) //jogador 2
        console.log("valor da aposta: " + (await game.poolBalance()))

        // commit
        const hash1 = await game.hashData(nonce1, 20);
        const hash2 = await game.hashData(nonce2, 2);

        await game.connect(player1).commit(hash1);
        await game.connect(player2).commit(hash2);

        // revelado valores
        await game.connect(player1).reveal(nonce1, 20);
        await game.connect(player2).reveal(nonce2, 2);

        await game.gameLogic();
    })
})
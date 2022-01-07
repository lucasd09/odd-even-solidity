//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./CommitAuth.sol";
import "hardhat/console.sol";

contract Game {
    using CommitAuth for CommitAuth.CommitType;

    enum ChosenPlay {
        Even,
        Odd,
        None
    }

    struct Player {
        ChosenPlay playOfChoice;
        bool hasChosen;
        CommitAuth.CommitType sc;
        bool exists;
    }   

    uint256 pool = 0;
    bool ok;
    uint total;
    address payable player1;
    address payable player2;
    mapping(address  => Player) public players;

    constructor(address payable _address1, address payable _address2) {
        ok = false;
        player1 = _address1;
        player2 = _address2;
        CommitAuth.CommitType memory sc1;
        CommitAuth.CommitType memory sc2;

        players[_address1] = Player(
        {
            playOfChoice: ChosenPlay.None,
            hasChosen: false,
            sc:  sc1,
            exists: true
        });

        players[_address2] = Player(
        {
            playOfChoice: ChosenPlay.None,
            hasChosen: false,
            sc:  sc2,
            exists: true
        });
    }

    modifier chooseOnce {
        require(players[msg.sender].hasChosen == false, "you can't change your choice");
        _;
    }

    modifier isPlayer {
        require (players[msg.sender].exists == true,
         "msg.sender needs to be one of the participants");
        _;
   }    

    function choice(uint _choice) public isPlayer chooseOnce{
        if(_choice == 0){
            players[msg.sender].playOfChoice = ChosenPlay.Even;
            players[msg.sender].hasChosen = true;

        }
        if(_choice == 1){
            players[msg.sender].playOfChoice = ChosenPlay.Odd;
            players[msg.sender].hasChosen = true;
        }
    }

    function doBet(uint256 _bet) public payable isPlayer{
        require(players[msg.sender].exists == true, "player tem que existir");
        pool += _bet;  
    }

    function poolBalance() public view returns (uint) {
        return pool;
    }

    function commit(bytes32 h) public payable isPlayer{
        require(players[msg.sender].hasChosen == true, "jogador tem que escolher");
        players[msg.sender].sc.commit(h);
    }

    function reveal(string memory nonce, uint256 val) public isPlayer{
        players[msg.sender].sc.reveal(nonce,val);
        bool revealed1 = players[player1].sc.isRevealed();
        bool revealed2 = players[player2].sc.isRevealed();
        if(revealed1 && revealed2){
            ok = true;
        }
    }

    function gameLogic() public payable isPlayer{
        bool hasRevealed1 = players[player1].sc.isRevealed();
        bool hasRevealed2 = players[player2].sc.isRevealed();

        if(!hasRevealed1 && !hasRevealed2){
            revert("um dos dois esta errado");
        }

        if (!hasRevealed1){
            player2.call{value: pool};
            console.log("player2 venceu pq revelou");
        }
        if (!hasRevealed2){
            player1.call{value: pool};
            console.log("player1 venceu pq revelou");
        }

        total = players[player1].sc.getValue() + players[player2].sc.getValue();
        if(total%2 == 0) {
            if(players[player1].playOfChoice == ChosenPlay.Even){
                 player1.call{value: pool};
                 console.log("player1 venceu");
            }
            if(players[player2].playOfChoice == ChosenPlay.Even){
                 player2.call{value: pool};
                 console.log("player2 venceu");
            }
        } else {
            if(players[player1].playOfChoice == ChosenPlay.Odd){
                 player1.call{value: pool};
                 console.log("player1 venceu");
            }
            if(players[player2].playOfChoice == ChosenPlay.Odd){
                 player2.call{value: pool};
                 console.log("player2 venceu");
            }  
        }
    }

    function hashData(string memory nonce, uint256 val ) public pure returns (bytes32) {
        return sha256(abi.encodePacked(nonce, val));
    }

    function getResult() public view returns (bool) {
        return ok;
    }
}
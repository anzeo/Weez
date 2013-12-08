/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import Phase = require("src/game/Phase");
import Card = require("src/card/Card");
import Player = require("src/player/Player");
import Deck = require("src/card/Deck");

describe("After a game has been dealt", function(){

    var game;
    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        game = new Game(deck, [new Player(), new Player(), new Player(), new Player()], undefined, undefined);
        game.deal();
    });

    it("each player holds 13 cards", function(){
        for(var i = 0; i < 4; i++){
            expect(game.players[i].hand.length).toEqual(13);
        }
    });

    it("the deck is empty", function(){
        expect(game.deck.cards.length).toEqual(0)
    });

    it("the current player is the next player to the dealer", function(){
        expect(game.players.indexOf(game.currentPlayer)).toEqual(game.players.indexOf(game.dealer) +1);
    });

    it("the cards have been dealt 4-4-5", function(){
        game = new Game(new Deck(), [new Player(), new Player(), new Player(), new Player()], undefined, undefined);
        var player1ExpectedHand = getCards([39,38,37,36,23,22,21,20,4,3,2,1,0]), // dealers
            player2ExpectedHand = getCards([51,50,49,48,35,34,33,32,19,18,17,16,15]),
            player3ExpectedHand = getCards([47,46,45,44,31,30,29,28,14,13,12,11,10]),
            player4ExpectedHand = getCards([43,42,41,40,27,26,25,24,9,8,7,6,5]);

        game.deal();

        expect(game.players[0].hand.sort(sortCards)).toEqual(player1ExpectedHand);
        expect(game.players[1].hand.sort(sortCards)).toEqual(player2ExpectedHand);
        expect(game.players[2].hand.sort(sortCards)).toEqual(player3ExpectedHand);
        expect(game.players[3].hand.sort(sortCards)).toEqual(player4ExpectedHand);
    });


    it("the default trump is known in case the game is not in troel and is equal to the suit of the last card dealt", function(){
        expect(game.defaultTrump).toEqual(game.dealer.hand[8].suit); // when taking the cards of the deck they are not reversed,
        // hence the first card of the original deck will be the first of the last 5 dealt and hence will be on index 8 instead of 12
    });

    it("the game is in the bid phase", function(){
        expect(game.phase).toEqual(Phase.BID);
    });

    function getCards(numbers: Array<number>) {
        var cards = [];
        for(var i = 0; i < numbers.length; i++){
            cards.push(game.deck.cards[numbers[i]]);
        }
        return cards.sort(sortCards);
    }

    function sortCards(left: Card, right: Card): number{
        if(left.suit === right.suit){
            return left.value < right.value ? 1 : -1;
        }
        return left.suit < right.suit ? 1 : -1
    }
});
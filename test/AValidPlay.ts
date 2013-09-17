/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import BidAction = require("src/action/BidAction");
import PlayAction = require("src/action/PlayAction");
import Bid = require("src/bid/Bid");
import Mode = require("src/game/Mode");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Card = require("src/card/Card");
import Suit = require("src/card/Suit");

describe("A play action is valid", function(){

    beforeEach(function(){
        Game.setup(new Deck(), [new Player(), new Player(), new Player(), new Player()]);
        Game.deal();
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid()),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(Mode.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(Mode.PASS));

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();
    })

    it("If the game is in the play phase", function(){
        Game.setup(new Deck(), [new Player(), new Player(), new Player(), new Player()]);
        Game.deal();

        var playAction = new PlayAction(Game.players[1], Game.players[1].hand[0]),
            bidActionPlayer2 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid()),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(Mode.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(Mode.PASS));

        expect(playAction.isValid()).toEqual(false);

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();

        expect(playAction.isValid()).toEqual(true);

    })

    it("If the player is the active player", function(){
        var playActionPlayer2 = new PlayAction(Game.players[1], Game.players[1].hand[0]),
            playActionPlayer3 = new PlayAction(Game.players[2], Game.players[2].hand[0]);

        expect(playActionPlayer3.isValid()).toEqual(false);

        playActionPlayer2.execute();

        expect(playActionPlayer3.isValid()).toEqual(true);
    })

    it("If the player owns the card", function(){
        var playActionPlayer2 = new PlayAction(Game.players[1], Game.players[0].hand[0]);

        expect(playActionPlayer2.isValid()).toEqual(false);
    })

    it("If the played card has the same trump as the first card played in the round", function(){
        var player2 = Game.players[1],
            player3 = Game.players[2],
            cardPlayedBy2 = player2.hand[0],
            validCardPlayedBy3 = getCardOfSameSuit(player3, cardPlayedBy2.suit),
            invalidCardPlayedBy3 = getCardOfDifferentSuit(player3, cardPlayedBy2.suit),
            playActionPlayer2 = new PlayAction(player2, cardPlayedBy2),
            validPlayActionPlayer3 = new PlayAction(player3, validCardPlayedBy3),
            invalidPlayActionPlayer3 = new PlayAction(player3, invalidCardPlayedBy3);

        playActionPlayer2.execute();

        expect(invalidPlayActionPlayer3.isValid()).toEqual(false);
        expect(validPlayActionPlayer3.isValid()).toEqual(true);
    })

    xit("If the played card has another trump as the first card of the round, but the player has no cards left of that trump in his hand", function(){

    })
})

function getCardOfSameSuit(player: Player, suit: Suit): Card{
    for(var i = 0; i < player.hand.length; i++){
        if(player.hand[i].suit === suit)
            return player.hand[i];
    }
    return undefined;
}

function getCardOfDifferentSuit(player: Player, suit: Suit): Card{
    for(var i = 0; i < player.hand.length; i++){
        if(player.hand[i].suit !== suit)
            return player.hand[i];
    }
    return undefined;
}
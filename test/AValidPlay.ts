/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import ActionFactory = require("src/action/ActionFactory");
import Mode = require("src/game/Mode");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Card = require("src/card/Card");
import Suit = require("src/card/Suit");
import Phase = require("src/game/Phase");

describe("A play action is valid", function(){

    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        Game.setup(deck, [new Player(), new Player(), new Player(), new Player()]);
        Game.deal();
        var bidActionPlayer2 = ActionFactory.createNormalBidAction(Game.players[1]),
            bidActionPlayer3 = ActionFactory.createNormalBidAction(Game.players[2]),
            bidActionPlayer4 = ActionFactory.createPassBidAction(Game.players[3]),
            bidActionPlayer1 = ActionFactory.createPassBidAction(Game.players[0]);

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();
    });

    it("If the game is in the play phase", function(){
        var playAction = ActionFactory.createPlayAction(Game.players[1], Game.players[1].hand[0]);
        Game.phase = Phase.BID;
        expect(playAction.isValid()).toEqual(false);
        Game.phase = Phase.PLAY;
        expect(playAction.isValid()).toEqual(true);
    });

    it("If the player is the active player", function(){
        var playActionPlayer2 = ActionFactory.createPlayAction(Game.players[1], Game.players[1].hand[0]),
            player3 = Game.players[2],
            playActionPlayer3 = ActionFactory.createPlayAction(player3, player3.hand[0]);

        expect(playActionPlayer3.isValid()).toEqual(false);

        playActionPlayer2.execute();

        spyOn(player3, "hasCardsOfSuit").andReturn(false);

        expect(playActionPlayer3.isValid()).toEqual(true);
    });

    it("If the player owns the card", function(){
        var invalidPlayAction = ActionFactory.createPlayAction(Game.players[1], Game.players[0].hand[0]),
            validPlayAction = ActionFactory.createPlayAction(Game.players[1], Game.players[1].hand[0]);

        expect(invalidPlayAction.isValid()).toEqual(false);
        expect(validPlayAction.isValid()).toEqual(true);
    });

    it("If the played card has the same trump as the first card played in the round", function(){
        var player2 = Game.players[1],
            player3 = Game.players[2],
            cardPlayedBy2 = new Card(1, Suit.HEARTS),
            validCardPlayedBy3 = new Card(2, Suit.HEARTS),
            invalidCardPlayedBy3 = new Card(1,Suit.CLUBS),
            playActionPlayer2 = ActionFactory.createPlayAction(player2, cardPlayedBy2),
            validPlayActionPlayer3 = ActionFactory.createPlayAction(player3, validCardPlayedBy3),
            invalidPlayActionPlayer3 = ActionFactory.createPlayAction(player3, invalidCardPlayedBy3);

        spyOn(player2, "owns").andReturn(true);
        spyOn(player3, "owns").andReturn(true);
        spyOn(player3, "hasCardsOfSuit").andReturn(true); // make sure playing a card of another suit will fail the test

        playActionPlayer2.execute();
        expect(invalidPlayActionPlayer3.isValid()).toEqual(false);
        expect(validPlayActionPlayer3.isValid()).toEqual(true);
    });

    it("If the played card has another suit as the first card of the round, but the player has no cards left of that trump in his hand", function(){
        var player2 = Game.players[1],
            player3 = Game.players[2],
            cardPlayedBy2 = new Card(1,Suit.HEARTS),
            cardPlayedBy3 = new Card(1,Suit.CLUBS),
            playAction2 = ActionFactory.createPlayAction(player2, cardPlayedBy2),
            playAction3 = ActionFactory.createPlayAction(player3, cardPlayedBy3);

        spyOn(player2, "owns").andReturn(true);
        spyOn(player3, "owns").andReturn(true);
        spyOn(player3, "hasCardsOfSuit").andReturn(false);

        playAction2.execute();
        expect(playAction3.isValid()).toEqual(true);
    })
});
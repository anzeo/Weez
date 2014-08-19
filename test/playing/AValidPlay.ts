/// <reference path="../../def/jasmine.d.ts" />
import Weez = require("../../src/Weez");
import Mode = require("../../src/game/Mode");
import Player = require("../../src/player/Player");
import Card = require("../../src/card/Card");
import Suit = require("../../src/card/Suit");
import Phase = require("../../src/game/Phase");
import ActionFactory = require("../../src/action/ActionFactory");

describe("A play action is valid", function(){

    var game;
    beforeEach(function(){
        game = Weez.getGame(Weez.createGame());
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();

        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        ActionFactory.createNormalBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();
    });

    it("If the game is in the play phase", function(){
        game.phase = Phase.BID;
        var action = ActionFactory.createPlayAction(game, game.players[1], game.players[1].hand[0]); 
        expect(action.isValid()).toEqual(false);
        game.phase = Phase.PLAY;
        expect(action.isValid()).toEqual(true);
    });

    it("If the player is the active player", function(){
        var player3Action = ActionFactory.createPlayAction(game, game.players[2], game.players[2].hand[0]); 

        expect(player3Action.isValid()).toEqual(false);

        ActionFactory.createPlayAction(game, game.players[1], game.players[1].hand[0]).execute();
        spyOn(game.players[2], "hasCardsOfSuit").andReturn(false);

        expect(player3Action.isValid()).toEqual(true);
    });

    it("If the player owns the card", function(){
        expect(ActionFactory.createPlayAction(game, game.players[1], game.players[0].hand[0]).isValid()).toEqual(false);
        expect(ActionFactory.createPlayAction(game, game.players[1], game.players[1].hand[0]).isValid()).toEqual(true);
    });

    it("If the played card has the same trump as the first card played in the round", function(){
        var player2 = game.players[1],
            player3 = game.players[2],
            cardPlayedBy2 = new Card(1, Suit.HEARTS),
            validCardPlayedBy3 = new Card(2, Suit.HEARTS),
            invalidCardPlayedBy3 = new Card(1, Suit.CLUBS);

        spyOn(player2, "owns").andReturn(true);
        spyOn(player3, "owns").andReturn(true);
        spyOn(player3, "hasCardsOfSuit").andReturn(true); // make sure playing a card of another suit will fail the test

        ActionFactory.createPlayAction(game, player2, cardPlayedBy2).execute();
        expect(ActionFactory.createPlayAction(game, player3, invalidCardPlayedBy3).isValid()).toEqual(false);
        expect(ActionFactory.createPlayAction(game, player3, validCardPlayedBy3).isValid()).toEqual(true);
    });

    it("If the played card has another suit as the first card of the round, but the player has no cards left of that trump in his hand", function(){
        var player2 = game.players[1],
            player3 = game.players[2],
            cardPlayedBy2 = new Card(1,Suit.HEARTS),
            cardPlayedBy3 = new Card(1,Suit.CLUBS);

        player2.hand = [cardPlayedBy2];
        player3.hand = [cardPlayedBy3];

        ActionFactory.createPlayAction(game, player2, cardPlayedBy2).execute();
        expect(ActionFactory.createPlayAction(game, player3, cardPlayedBy3).isValid()).toEqual(true);
    });
});
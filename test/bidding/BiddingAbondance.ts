/// <reference path="../../def/jasmine.d.ts" />
import Suit = require("../../src/card/Suit");
import Weez = require("../../src/Weez");
import Mode = require("../../src/game/Mode");
import Player = require("../../src/player/Player");
import ActionFactory = require("../../src/action/ActionFactory");

describe("A valid abondance bid", function(){

    var game;
    beforeEach(function(){
        game = Weez.getGame(Weez.createGame());
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();
    });

    it("is valid if the current resolved mode is normal", function(){
        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        expect(ActionFactory.createAbondanceBidAction(game, game.players[2], Suit.CLUBS).execute()).toEqual(true);    
        expect(ActionFactory.createPassBidAction(game, game.players[3]).execute()).toEqual(true);
        expect(ActionFactory.createPassBidAction(game, game.players[0]).execute()).toEqual(true);
    });

    it("can be resolved with only one active player", function(){
        expect(ActionFactory.createAbondanceBidAction(game, game.players[1], Suit.CLUBS).execute()).toEqual(true);
        expect(ActionFactory.createAbondanceBidAction(game, game.players[2], Suit.CLUBS).execute()).toEqual(false);
    });

    it("has precedence over another abondance bid in case it is made in the default trump", function(){
        game.defaultTrump = Suit.CLUBS;
        
        ActionFactory.createAbondanceBidAction(game, game.players[1], Suit.HEARTS).execute();
        expect(ActionFactory.createAbondanceBidAction(game, game.players[2], Suit.CLUBS).execute()).toEqual(true);
    });

    it("has precedence over another abondance bid in case it is made in a higher trump", function(){
        game.defaultTrump = Suit.SPADES;
        
        ActionFactory.createAbondanceBidAction(game, game.players[1], Suit.CLUBS).execute();
        expect(ActionFactory.createAbondanceBidAction(game, game.players[2], Suit.DIAMONDS).execute()).toEqual(true);
    });

    it("is resolved with the same trump of the winning bid", function(){
        game.defaultTrump = Suit.CLUBS;

        ActionFactory.createAbondanceBidAction(game, game.players[1], Suit.DIAMONDS).execute();
        ActionFactory.createPassBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();

        expect(game.mode).toEqual(Mode.ABONDANCE);
        expect(game.target).toEqual(9);
        expect(game.trump).toEqual(Suit.DIAMONDS);
    });
});
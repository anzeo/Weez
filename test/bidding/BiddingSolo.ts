/// <reference path="../../def/jasmine.d.ts" />
import ActionFactory = require("../../src/action/ActionFactory");
import Suit = require("../../src/card/Suit");
import Weez = require("../../src/Weez");
import Mode = require("../../src/game/Mode");
import Deck = require("../../src/card/Deck");
import Player = require("../../src/player/Player");

describe("A valid solo bid", function(){

    var game;
    beforeEach(function(){
        game = Weez.getGame(Weez.createGame());
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();
    });

    it("can be made any time", function(){
        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        ActionFactory.createMiseryBidAction(game, game.players[2]).execute();
        expect(ActionFactory.createSoloBidAction(game, game.players[3]).execute()).toEqual(true);
    });

    it("can be resolved with only 1 active player", function(){
        expect(ActionFactory.createSoloBidAction(game, game.players[1]).execute()).toEqual(true);
        expect(ActionFactory.createSoloBidAction(game, game.players[2]).execute()).toEqual(false);
    });

    it("is always resolved with a target of 13", function(){
        ActionFactory.createSoloBidAction(game, game.players[1]).execute();
        ActionFactory.createPassBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();

        expect(game.mode).toEqual(Mode.SOLO);
        expect(game.target).toEqual(13);
        expect(game.trump).toEqual(game.defaultTrump);
    });

    describe("can be overtrumped", function(){
        it("by bidding with a higher suit", function(){
            game.defaultTrump = Suit.DIAMONDS;

            ActionFactory.createSoloBidAction(game, game.players[1], Suit.SPADES).execute()
            expect(ActionFactory.createSoloBidAction(game, game.players[2], Suit.CLUBS).execute()).toEqual(true);
        });

        it("by bidding with the default trump", function(){
            game.defaultTrump = Suit.SPADES;

            ActionFactory.createSoloBidAction(game, game.players[1], Suit.HEARTS).execute();
            expect(ActionFactory.createSoloBidAction(game, game.players[2], Suit.SPADES).execute()).toEqual(true);
        });
    });
});
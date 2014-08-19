/// <reference path="../../def/jasmine.d.ts" />
import Suit = require("../../src/card/Suit");
import Weez = require("../../src/Weez");
import Mode = require("../../src/game/Mode");
import Player = require("../../src/player/Player");
import Phase = require("../../src/game/Phase");
import ActionFactory = require("../../src/action/ActionFactory");

describe("A normal bid", function(){
    var game;
    beforeEach(function(){
        game = Weez.getGame(Weez.createGame());
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();
    });

    it("is not valid in case a previous bid was made for misery", function(){
        ActionFactory.createMiseryBidAction(game,game.players[1]).execute();
        expect(ActionFactory.createNormalBidAction(game, game.players[2]).execute()).toEqual(false);
    });

    it("does not allow more than 2 active players", function(){
        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        ActionFactory.createNormalBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();

        expect(ActionFactory.createNormalBidAction(game, game.players[0]).execute()).toEqual(false);
    });

    it("has to be confirmed in case there's only one active player", function(){
        var bidActionPlayer2Pass = ActionFactory.createPassBidAction(game,game.players[1]);

        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        ActionFactory.createPassBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();

        expect(game.phase).toEqual(Phase.BID);
        expect(game.mode).toBeUndefined();
        
        // confirm that a pass was valid as well TODO execute this!
        expect(bidActionPlayer2Pass.isValid()).toEqual(true);
        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        expect(game.phase).toEqual(Phase.PLAY);
        expect(game.mode).toEqual(Mode.NORMAL);
        expect(game.currentPlayer).toEqual(game.players[1]);
        expect(game.trump).toEqual(game.defaultTrump);
    });

    it("can be resolved with 2 active players at a target of 8", function(){
        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        ActionFactory.createNormalBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();
        
        expect(game.target).toEqual(8);
    });

    it("can be resolved with 1 active players at a target of 5", function(){
        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        ActionFactory.createPassBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();
        ActionFactory.createNormalBidAction(game, game.players[1]).execute();

        expect(game.target).toEqual(5);
    });

    it("is always resolved with the default trump", function(){
        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        ActionFactory.createNormalBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();

        expect(game.trump).toEqual(game.defaultTrump);
    });
});
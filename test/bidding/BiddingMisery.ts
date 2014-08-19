/// <reference path="../../def/jasmine.d.ts" />
import Weez = require("../../src/Weez");
import Mode = require("../../src/game/Mode");
import Player = require("../../src/player/Player");
import ActionFactory = require("../../src/action/ActionFactory");

describe("A valid misery bid", function(){

    var game;
    beforeEach(function(){
        game = Weez.getGame(Weez.createGame());
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();
    });

    it("can be made any time", function() {
        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        expect(ActionFactory.createMiseryBidAction(game, game.players[2]).execute()).toEqual(true);
        expect(ActionFactory.createMiseryBidAction(game, game.players[3]).execute()).toEqual(true);
        expect(ActionFactory.createMiseryBidAction(game, game.players[0]).execute()).toEqual(true);
    });

    it("can be resolved with up to 4 active players at a target of 0", function(){
        ActionFactory.createMiseryBidAction(game, game.players[1]).execute();
        ActionFactory.createMiseryBidAction(game, game.players[2]).execute();
        ActionFactory.createMiseryBidAction(game, game.players[3]).execute();
        ActionFactory.createMiseryBidAction(game, game.players[0]).execute();

        expect(game.mode).toEqual(Mode.MISERY);
        expect(game.activePlayers.length).toEqual(4);
    });

    it("is always resolved with a target of 0 and no trump", function(){
        ActionFactory.createMiseryBidAction(game, game.players[1]).execute();
        ActionFactory.createPassBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();

        expect(game.mode).toEqual(Mode.MISERY);
        expect(game.target).toEqual(0);
        expect(game.trump).toBeUndefined();
    });
});
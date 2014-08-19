/// <reference path="../../def/jasmine.d.ts" />
import Weez = require("../../src/Weez");
import Mode = require("../../src/game/Mode");
import Player = require("../../src/player/Player");
import ActionFactory = require("../../src/action/ActionFactory");

describe("A game can be passed", function(){

    var game;
    beforeEach(function(){
        game = Weez.getGame(Weez.createGame());
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();
    });

    it("in case all players have passed", function(){
        ActionFactory.createPassBidAction(game, game.players[1]).execute();
        ActionFactory.createPassBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();

        expect(game.mode).toEqual(Mode.PASS);
        expect(game.trump).toBeUndefined();
        expect(game.target).toEqual(0);
    });
});
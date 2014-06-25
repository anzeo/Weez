/// <reference path="../def/jasmine.d.ts" />
import Weez = require("../src/Weez");
import Mode = require("../src/game/Mode");
import Player = require("../src/player/Player");

describe("A game can be passed", function(){

    var game;
    beforeEach(function(){
        game = Weez.createGame([new Player(), new Player(), new Player(), new Player()]);
        game.deal();
    });

    it("in case all players have passed", function(){
        Weez.pass(game.players[1]);
        Weez.pass(game.players[2]);
        Weez.pass(game.players[3]);
        Weez.pass(game.players[0]);

        expect(game.mode).toEqual(Mode.PASS);
        expect(game.trump).toBeUndefined();
        expect(game.target).toEqual(0);
    });
});
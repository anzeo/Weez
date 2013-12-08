/// <reference path="../def/jasmine.d.ts" />
import Weez = require("src/Weez");
import Mode = require("src/game/Mode");
import Player = require("src/player/Player");

describe("A valid misery bid", function(){

    var game;
    beforeEach(function(){
        game = Weez.createGame([new Player(), new Player(), new Player(), new Player()]);
        game.deal();
    });

    it("can be made any time", function(){
        Weez.bid(game.players[1]);
        expect(Weez.bidMisery(game.players[2])).toEqual(true);
        expect(Weez.bidMisery(game.players[3])).toEqual(true);
        expect(Weez.bidMisery(game.players[0])).toEqual(true);
    });

    it("can be resolved with up to 4 active players at a target of 0", function(){
        Weez.bidMisery(game.players[1]);
        Weez.bidMisery(game.players[2]);
        Weez.bidMisery(game.players[3]);
        Weez.bidMisery(game.players[0]);

        expect(game.mode).toEqual(Mode.MISERY);
        expect(game.activePlayers.length).toEqual(4);
    });

    it("is always resolved with a target of 0 and no trump", function(){
        Weez.bidMisery(game.players[1]);
        Weez.pass(game.players[2]);
        Weez.pass(game.players[3]);
        Weez.pass(game.players[0]);

        expect(game.mode).toEqual(Mode.MISERY);
        expect(game.target).toEqual(0);
        expect(game.trump).toBeUndefined();
    });
});
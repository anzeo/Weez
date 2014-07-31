/// <reference path="../../def/jasmine.d.ts" />
import Game = require("../../src/game/Game");
import Phase = require("../../src/game/Phase");
import Player = require("../../src/player/Player");
import Deck = require("../../src/card/Deck");

describe("Dealing the game", function(){

    it("is only possible when 4 players have been added to the game", function(){
        var game = new Game(new Deck(),undefined,undefined);
        game.deal();
        expect(game.phase).toEqual(Phase.SETUP);
        game.players.push(new Player());
        game.deal();
        expect(game.phase).toEqual(Phase.SETUP);
        game.players = [new Player(),new Player(),new Player(),new Player()];
        game.deal();
        expect(game.phase).toEqual(Phase.BID);
    });
});
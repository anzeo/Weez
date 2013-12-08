/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import Phase = require("src/game/Phase");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");

describe("A new game", function(){

    var game;
    beforeEach(function(){
        game = new Game(new Deck(), [new Player(), new Player(), new Player(), new Player()],undefined,undefined);
    });

    it("has 4 players", function(){
        expect(game.players.length).toEqual(4);
    });

    it("has a deck of 52 unique cards", function(){
        expect(game.deck.cards.length).toEqual(52);
    });

    it("has a dealer", function(){
        expect(game.dealer).toBeDefined();
        expect(game.dealer).toEqual(game.players[0]);
    });

    it("is in the setup phase", function(){
        expect(game.phase).toEqual(Phase.SETUP);
    });
});
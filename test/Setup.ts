/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import Phase = require("src/game/Phase");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");

describe("A new game", function(){

    beforeEach(function(){
        Game.setup(new Deck(), [new Player(), new Player(), new Player(), new Player()]);
    })

    it("has 4 players", function(){
        expect(Game.players.length).toEqual(4);
    })

    it("has a deck of 52 unique cards", function(){
        expect(Game.deck.cards.length).toEqual(52);
    })

    it("has a dealer", function(){
        expect(Game.dealer).toBeDefined();
        expect(Game.dealer).toEqual(Game.players[0]);
    })

    it("is in the setup phase", function(){
        expect(Game.phase).toEqual(Phase.SETUP);
    })
})
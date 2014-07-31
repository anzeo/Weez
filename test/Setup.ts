/// <reference path="../def/jasmine.d.ts" />
import Game = require("../src/game/Game");
import Phase = require("../src/game/Phase");
import Deck = require("../src/card/Deck");

describe("A new game", function(){

    var game;
    beforeEach(function(){
        game = new Game(new Deck(),undefined,undefined);
    });

    it("has a deck of 52 unique cards", function(){
        expect(game.deck.cards.length).toEqual(52);
    });

    it("is in the setup phase", function(){
        expect(game.phase).toEqual(Phase.SETUP);
    });
});
/// <reference path="../../def/jasmine.d.ts" />
import Suit = require("../../src/card/Suit");
import Weez = require("../../src/Weez");
import Mode = require("../../src/game/Mode");
import Player = require("../../src/player/Player");

describe("A valid abondance bid", function(){

    var game;
    beforeEach(function(){
        game = Weez.createGame();
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();
    });

    it("is valid if the current resolved mode is normal", function(){
        Weez.bid(game.players[1]);
        expect(Weez.bidAbondance(game.players[2],Suit.CLUBS)).toEqual(true);
        expect(Weez.pass(game.players[3])).toEqual(true);
        expect(Weez.pass(game.players[0])).toEqual(true);
    });

    it("can be resolved with only one active player", function(){
        expect(Weez.bidAbondance(game.players[1],Suit.CLUBS)).toEqual(true);
        expect(Weez.bidAbondance(game.players[2],Suit.CLUBS)).toEqual(false);
    });

    it("has precedence over another abondance bid in case it is made in the default trump", function(){
        game.defaultTrump = Suit.CLUBS;

        Weez.bidAbondance(game.players[1],Suit.HEARTS);
        expect(Weez.bidAbondance(game.players[2],Suit.CLUBS)).toEqual(true);
    });

    it("has precedence over another abondance bid in case it is made in a higher trump", function(){
        game.defaultTrump = Suit.SPADES;

        Weez.bidAbondance(game.players[1],Suit.CLUBS);
        expect(Weez.bidAbondance(game.players[2],Suit.DIAMONDS)).toEqual(true);
    });

    it("is resolved with the same trump of the winning bid", function(){
        game.defaultTrump = Suit.CLUBS;

        Weez.bidAbondance(game.players[1], Suit.DIAMONDS);
        Weez.pass(game.players[2]);
        Weez.pass(game.players[3]);
        Weez.pass(game.players[0]);

        expect(game.mode).toEqual(Mode.ABONDANCE);
        expect(game.target).toEqual(9);
        expect(game.trump).toEqual(Suit.DIAMONDS);
    });
});
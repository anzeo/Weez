/// <reference path="../def/jasmine.d.ts" />
import ActionFactory = require("../src/action/ActionFactory");
import Suit = require("../src/card/Suit");
import Weez = require("../src/Weez");
import Mode = require("../src/game/Mode");
import Deck = require("../src/card/Deck");
import Player = require("../src/player/Player");

describe("A valid solo bid", function(){

    var game;
    beforeEach(function(){
        game = Weez.createGame([new Player(), new Player(), new Player(), new Player()]);
        game.deal();
    });

    it("can be made any time", function(){
        Weez.bid(game.players[1]);
        expect(Weez.bidMisery(game.players[2])).toEqual(true);
        expect(Weez.bidSolo(game.players[3])).toEqual(true);
    });

    it("can be resolved with only 1 active player", function(){
        expect(Weez.bidSolo(game.players[1])).toEqual(true);
        expect(Weez.bidSolo(game.players[2])).toEqual(false);
    });

    it("is always resolved with a target of 13", function(){
        Weez.bidSolo(game.players[1]);
        Weez.pass(game.players[2]);
        Weez.pass(game.players[3]);
        Weez.pass(game.players[0]);

        expect(game.mode).toEqual(Mode.SOLO);
        expect(game.target).toEqual(13);
        expect(game.trump).toEqual(game.defaultTrump);
    });

    describe("can be overtrumped", function(){
        it("by bidding with a higher suit", function(){
            game.defaultTrump = Suit.DIAMONDS;

            Weez.bidSolo(game.players[1], Suit.SPADES);
            expect(Weez.bidSolo(game.players[2], Suit.CLUBS)).toEqual(true);
        });

        it("by bidding with the default trump", function(){
            game.defaultTrump = Suit.SPADES;

            Weez.bidSolo(game.players[1], Suit.HEARTS);
            expect(Weez.bidSolo(game.players[2], Suit.SPADES)).toEqual(true);
        });
    });
});
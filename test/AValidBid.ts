/// <reference path="../def/jasmine.d.ts" />
import Suit = require("../src/card/Suit");
import Weez = require("../src/Weez");
import Mode = require("../src/game/Mode");
import Player = require("../src/player/Player");
import Phase = require("../src/game/Phase");

describe("A valid bid", function(){

    var game;
    beforeEach(function(){
        game = Weez.createGame([new Player(), new Player(), new Player(), new Player()]);
        game.deal();
    });

    it("is made in the bid phase", function(){
        game.phase = Phase.SETUP;
        var bidActionIsValid = Weez.bid(game.players[1]);
        expect(bidActionIsValid).toEqual(false);
        game.phase = Phase.BID;
        bidActionIsValid = Weez.bid(game.players[1]);
        expect(bidActionIsValid).toEqual(true);
    });

    it("is made in the current player's turn", function(){
        var player2BidIsValid = Weez.bid(game.players[2]);
        expect(player2BidIsValid).toEqual(false);

        Weez.bid(game.players[1]);

        player2BidIsValid = Weez.bid(game.players[2]);
        expect(player2BidIsValid).toEqual(true);
    });

    it("can be made only once per player", function(){
        var bidActionWasValid = Weez.bid(game.players[1]);

        expect(bidActionWasValid).toEqual(true);

        bidActionWasValid = Weez.bid(game.players[1]);

        expect(bidActionWasValid).toEqual(false);
    });

    it("will only be resolved if all 4 players have bid", function(){
        Weez.bid(game.players[1]);
        expect(game.phase).toEqual(Phase.BID);
        expect(game.mode).toBeUndefined();
        Weez.bid(game.players[2]);
        expect(game.phase).toEqual(Phase.BID);
        expect(game.mode).toBeUndefined();
        Weez.pass(game.players[3]);
        expect(game.phase).toEqual(Phase.BID);
        expect(game.mode).toBeUndefined();
        Weez.pass(game.players[0]);
        expect(game.phase).toEqual(Phase.PLAY);
        expect(game.mode).toEqual(Mode.NORMAL);
        expect(game.currentPlayer).toEqual(game.players[1]);
    });
});
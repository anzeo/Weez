/// <reference path="../../def/jasmine.d.ts" />
import Suit = require("../../src/card/Suit");
import Weez = require("../../src/Weez");
import Mode = require("../../src/game/Mode");
import Player = require("../../src/player/Player");
import Phase = require("../../src/game/Phase");
import PassBidAction = require("../../src/action/PassBidAction");

describe("A normal bid", function(){
    var game;
    beforeEach(function(){
        game = Weez.createGame();
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();
    });

    it("is not valid in case a previous bid was made for misery", function(){
        Weez.bidMisery(game.players[1]);
        var bidActionPlayer3IsValid = Weez.bid(game.players[2]);

        expect(bidActionPlayer3IsValid).toEqual(false);
    });

    it("does not allow more than 2 active players", function(){
        Weez.bid(game.players[1]);
        Weez.bid(game.players[2]);
        Weez.pass(game.players[3]);

        var bidActionPlayer1IsValid = Weez.bid(game.players[0]);
        expect(bidActionPlayer1IsValid).toEqual(false);
    });

    it("has to be confirmed in case there's only one active player", function(){
        var bidActionPlayer2Pass = new PassBidAction(game,game.players[1]);

        var initialBidPlayerIsValid = Weez.bid(game.players[1]);
        Weez.pass(game.players[2]);
        Weez.pass(game.players[3]);
        Weez.pass(game.players[0]);

        expect(game.phase).toEqual(Phase.BID);
        expect(game.mode).toBeUndefined();
        expect(initialBidPlayerIsValid).toEqual(true);
        // confirm that a pass was valid as well TODO execute this!
        expect(bidActionPlayer2Pass.isValid()).toEqual(true);
        Weez.bid(game.players[1]);
        expect(game.phase).toEqual(Phase.PLAY);
        expect(game.mode).toEqual(Mode.NORMAL);
        expect(game.currentPlayer).toEqual(game.players[1]);
        expect(game.trump).toEqual(game.defaultTrump);
    });

    it("can be resolved with 2 active players at a target of 8", function(){
        Weez.bid(game.players[1]);
        Weez.bid(game.players[2]);
        Weez.pass(game.players[3]);
        Weez.pass(game.players[0]);

        expect(game.target).toEqual(8);
    });

    it("can be resolved with 1 active players at a target of 5", function(){
        Weez.pass(game.players[1]);
        Weez.pass(game.players[2]);
        Weez.bid(game.players[3]);
        Weez.pass(game.players[0]);
        Weez.bid(game.players[3]); // confirm

        expect(game.target).toEqual(5);
    });

    it("is always resolved with the default trump", function(){
        Weez.bid(game.players[1]);
        Weez.bid(game.players[2]);
        Weez.pass(game.players[3]);
        Weez.pass(game.players[0]);

        expect(game.trump).toEqual(game.defaultTrump);
    });
});
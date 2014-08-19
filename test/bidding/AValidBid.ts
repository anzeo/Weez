/// <reference path="../../def/jasmine.d.ts" />
import Suit = require("../../src/card/Suit");
import Weez = require("../../src/Weez");
import Mode = require("../../src/game/Mode");
import Player = require("../../src/player/Player");
import Phase = require("../../src/game/Phase");
import ActionFactory = require("../../src/action/ActionFactory");

describe("A valid bid", function(){

    var game;
    beforeEach(function(){
        game = Weez.getGame(Weez.createGame());
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();
    });

    it("is made in the bid phase", function(){
        game.phase = Phase.SETUP;
        var bidAction = ActionFactory.createNormalBidAction(game,game.players[1]);
        expect(bidAction.isValid()).toEqual(false);
        game.phase = Phase.BID;
        expect(bidAction.isValid()).toEqual(true);
    });

    it("is made in the current player's turn", function(){
        var player2Bid = ActionFactory.createNormalBidAction(game,game.players[2]);
        expect(player2Bid.isValid()).toEqual(false);

        ActionFactory.createNormalBidAction(game,game.players[1]).execute();

        expect(player2Bid.isValid()).toEqual(true);
    });

    it("can be made only once per player", function(){
        var bidAction = ActionFactory.createNormalBidAction(game,game.players[1]);

        expect(bidAction.execute()).toEqual(true);
        expect(bidAction.isValid()).toEqual(false);
    });

    it("will only be resolved if all 4 players have bid", function(){
        ActionFactory.createNormalBidAction(game,game.players[1]).execute();
        expect(game.phase).toEqual(Phase.BID);
        expect(game.mode).toBeUndefined();
        ActionFactory.createNormalBidAction(game,game.players[2]).execute();
        expect(game.phase).toEqual(Phase.BID);
        expect(game.mode).toBeUndefined();
        ActionFactory.createPassBidAction(game,game.players[3]).execute();
        expect(game.phase).toEqual(Phase.BID);
        expect(game.mode).toBeUndefined();
        ActionFactory.createPassBidAction(game,game.players[0]).execute();
        expect(game.phase).toEqual(Phase.PLAY);
        expect(game.mode).toEqual(Mode.NORMAL);
        expect(game.currentPlayer).toEqual(game.players[1]);
    });
});
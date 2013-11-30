/// <reference path="../def/jasmine.d.ts" />
import ActionFactory = require("src/action/ActionFactory");
import Suit = require("src/card/Suit");
import Game = require("src/game/Game");
import Mode = require("src/game/Mode");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");

describe("A valid solo bid", function(){

    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        Game.setup(deck, [new Player(), new Player(), new Player(), new Player()]);
        Game.deal();
    });

    it("can be made any time", function(){
        var player2BidAction = ActionFactory.createNormalBidAction(Game.players[1]);
        var player3BidAction = ActionFactory.createMiseryBidAction(Game.players[2]);
        var player4BidAction = ActionFactory.createSoloBidAction(Game.players[3]);

        player2BidAction.execute();
        expect(player3BidAction.isValid()).toEqual(true);
        player3BidAction.execute();
        expect(player4BidAction.isValid()).toEqual(true);
    });

    it("can be resolved with only 1 active player", function(){
        var player2BidAction = ActionFactory.createSoloBidAction(Game.players[1]);
        var player3BidAction = ActionFactory.createSoloBidAction(Game.players[2]);

        player2BidAction.execute();

        expect(player3BidAction.isValid()).toEqual(false);
    });

    it("is always resolved with a target of 13", function(){
        var player2BidAction = ActionFactory.createSoloBidAction(Game.players[1]);
        var player3BidAction = ActionFactory.createPassBidAction(Game.players[2]);
        var player4BidAction = ActionFactory.createPassBidAction(Game.players[3]);
        var player1BidAction = ActionFactory.createPassBidAction(Game.players[0]);

        player2BidAction.execute();
        player3BidAction.execute();
        player4BidAction.execute();
        player1BidAction.execute();

        expect(Game.mode).toEqual(Mode.SOLO);
        expect(Game.target).toEqual(13);
        expect(Game.trump).toEqual(Game.defaultTrump);
    });

    describe("can be overtrumped", function(){
        it("by bidding with a higher suit", function(){
            var player2BidAction = ActionFactory.createSoloBidAction(Game.players[1], Suit.SPADES);
            var player3BidAction = ActionFactory.createSoloBidAction(Game.players[2], Suit.CLUBS);

            Game.defaultTrump = Suit.DIAMONDS;

            player2BidAction.execute();
            expect(player3BidAction.isValid()).toEqual(true);
        });

        it("by bidding with the default trump", function(){
            var player2BidAction = ActionFactory.createSoloBidAction(Game.players[1], Suit.HEARTS);
            var player3BidAction = ActionFactory.createSoloBidAction(Game.players[2], Suit.SPADES);

            Game.defaultTrump = Suit.SPADES;

            player2BidAction.execute();
            expect(player3BidAction.isValid()).toEqual(true);
        })
    })
});
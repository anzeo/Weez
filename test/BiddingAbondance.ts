/// <reference path="../def/jasmine.d.ts" />
import BidAction = require("src/action/BidAction");
import AbondanceBidAction = require("src/action/AbondanceBidAction");
import Bid = require("src/bid/Bid");
import Suit = require("src/card/Suit");
import Game = require("src/game/Game");
import Mode = require("src/game/Mode");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");

describe("A valid abondance bid", function(){

    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        Game.setup(deck, [new Player(), new Player(), new Player(), new Player()]);
        Game.deal();
    });

    it("is valid if the current resolved mode is normal", function(){
        var player2BidAction = new BidAction(Game.players[1], new Bid());
        var player3BidAction = new AbondanceBidAction(Game.players[2], Suit.CLUBS);
        var player4BidAction = new BidAction(Game.players[3], new Bid(Mode.PASS));
        var player1BidAction = new BidAction(Game.players[0], new Bid(Mode.PASS));

        player2BidAction.execute();
        expect(player3BidAction.isValid()).toEqual(true);
        player3BidAction.execute();
        expect(player4BidAction.isValid()).toEqual(true);
        player4BidAction.execute();
        expect(player1BidAction.isValid()).toEqual(true);
    });

    it("can be resolved with only one active player", function(){
        var player2BidAction = new AbondanceBidAction(Game.players[1], Suit.CLUBS);
        var player3BidAction = new AbondanceBidAction(Game.players[2], Suit.CLUBS);

        player2BidAction.execute();
        expect(player3BidAction.isValid()).toEqual(false);
    });

    it("has precedence over another abondance bid in case it is made in the default trump", function(){
        Game.defaultTrump = Suit.CLUBS;

        var player2BidAction = new AbondanceBidAction(Game.players[1], Suit.HEARTS);
        var player3BidAction = new AbondanceBidAction(Game.players[2], Suit.CLUBS);

        player2BidAction.execute();
        expect(player3BidAction.isValid()).toEqual(true);
    });

    it("is resolved with the same trump of the winning bid", function(){
        Game.defaultTrump = Suit.CLUBS;

        var player2BidAction = new AbondanceBidAction(Game.players[1], Suit.DIAMONDS);
        var player3BidAction = new BidAction(Game.players[2], new Bid(Mode.PASS));
        var player4BidAction = new BidAction(Game.players[3], new Bid(Mode.PASS));
        var player1BidAction = new BidAction(Game.players[0], new Bid(Mode.PASS));

        player2BidAction.execute();
        player3BidAction.execute();
        player4BidAction.execute();
        player1BidAction.execute();

        expect(Game.mode).toEqual(Mode.ABONDANCE);
        expect(Game.target).toEqual(9);
        expect(Game.trump).toEqual(Suit.DIAMONDS);
    });

});
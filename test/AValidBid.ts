/// <reference path="../def/jasmine.d.ts" />
import BidAction = require("src/action/BidAction");
import Bid = require("src/bid/Bid");
import Suit = require("src/card/Suit");
import Game = require("src/game/Game");
import Mode = require("src/game/Mode");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");

describe("A valid bid", function(){

    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        Game.setup(deck, [new Player(), new Player(), new Player(), new Player()]);
        Game.deal();
    });

    it("is made in the bid phase", function(){
        var bidAction = new BidAction(Game.players[1], new Bid() );

        Game.phase = Phase.SETUP;
        expect(bidAction.isValid()).toEqual(false);
        Game.phase = Phase.BID;
        expect(bidAction.isValid()).toEqual(true);
    });

    it("is made in the current player's turn", function(){
        var bidActionPlayer1 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer2 = new BidAction(Game.players[2], new Bid());

        expect(bidActionPlayer2.isValid()).toEqual(false);

        bidActionPlayer1.execute();

        expect(bidActionPlayer2.isValid()).toEqual(true);
    });

    it("can be made only once per player", function(){
        var bidAction = new BidAction(Game.players[1], new Bid() );

        expect(bidAction.isValid()).toEqual(true);

        bidAction.execute();

        expect(bidAction.isValid()).toEqual(false);
    });

    it("will only be resolved if all 4 players have bid", function(){
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid()),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(Mode.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(Mode.PASS));

        var expectedTrump = Game.defaultTrump;

        bidActionPlayer2.execute();
        expect(Game.phase).toEqual(Phase.BID);
        expect(Game.mode).toBeUndefined();
        bidActionPlayer3.execute();
        expect(Game.phase).toEqual(Phase.BID);
        expect(Game.mode).toBeUndefined();
        bidActionPlayer4.execute();
        expect(Game.phase).toEqual(Phase.BID);
        expect(Game.mode).toBeUndefined();
        bidActionPlayer1.execute();
        expect(Game.phase).toEqual(Phase.PLAY);
        expect(Game.mode).toEqual(Mode.NORMAL);
        expect(Game.currentPlayer).toEqual(Game.players[1]);
        expect(Game.trump).toEqual(expectedTrump);
    });
});
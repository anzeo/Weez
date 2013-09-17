/// <reference path="../def/jasmine.d.ts" />
import BidAction = require("src/bid/BidAction");
import Bid = require("src/bid/Bid");
import Suit = require("src/card/Suit");
import Game = require("src/game/Game");
import Mode = require("src/game/Mode");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");

describe("A valid bid", function(){

    beforeEach(function(){
        Game.setup(new Deck(), [new Player(), new Player(), new Player(), new Player()]);
        Game.deal();
    })

    it("is made in the bid phase", function(){
        Game.setup(new Deck(), [new Player(), new Player(), new Player(), new Player()]);
        var bidAction = new BidAction(Game.players[1], new Bid() );

        expect(bidAction.isValid()).toEqual(false);

        Game.deal();

        expect(bidAction.isValid()).toEqual(true);
    });

    it("is made in the current player's turn", function(){
        var bidActionPlayer1 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer2 = new BidAction(Game.players[2], new Bid());

        expect(bidActionPlayer2.isValid()).toEqual(false);

        bidActionPlayer1.execute();

        expect(bidActionPlayer2.isValid()).toEqual(true);
    })

    it("can be made only once per player", function(){
        var bidAction = new BidAction(Game.players[1], new Bid() );

        expect(bidAction.isValid()).toEqual(true);

        bidAction.execute();

        expect(bidAction.isValid()).toEqual(false);
    })

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
    })

    it("does not allow more than 2 active players", function(){
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid()),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(Mode.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid());

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        expect(bidActionPlayer1.isValid()).toEqual(false);
    })

    it("has to be confirmed in case there's only one active player", function(){
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer2Pass = new BidAction(Game.players[1], new Bid(Mode.PASS)),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid(Mode.PASS)),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(Mode.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(Mode.PASS));

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();
        expect(Game.phase).toEqual(Phase.BID);
        expect(Game.mode).toBeUndefined();
        expect(bidActionPlayer2.isValid()).toEqual(true);
        expect(bidActionPlayer2Pass.isValid()).toEqual(true);
        bidActionPlayer2.execute();
        expect(Game.phase).toEqual(Phase.PLAY);
        expect(Game.mode).toEqual(Mode.NORMAL);
        expect(Game.currentPlayer).toEqual(Game.players[1]);
        expect(Game.trump).toEqual(Game.defaultTrump);
    })

    it("can be resolved with 2 active players at a target of 8", function(){
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid()),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(Mode.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(Mode.PASS));

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();

        expect(Game.target).toEqual(8);
    })

    it("can be resolved with 1 active players at a target of 5", function(){
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid(Mode.PASS)),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid(Mode.PASS)),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid()),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(Mode.PASS));

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();
        bidActionPlayer4.execute();

        expect(Game.target).toEqual(5);
    })

    it("is always resolved with the default trump", function(){
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid(Mode.PASS)),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid()),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(Mode.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid());

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();

        expect(Game.trump).toEqual(Game.defaultTrump);
    })

    it("can be resolved to a pass in case all players have passed", function(){
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid(Mode.PASS)),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid(Mode.PASS)),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(Mode.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(Mode.PASS));

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();

        expect(Game.mode).toEqual(Mode.PASS);
        expect(Game.trump).toBeUndefined();
        expect(Game.target).toEqual(0);
    })
})
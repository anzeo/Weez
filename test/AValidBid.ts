/// <reference path="../def/jasmine.d.ts" />
import BidAction = require("src/bid/BidAction");
import Bid = require("src/bid/Bid");
import BidType = require("src/bid/BidType");
import Suit = require("src/card/Suit");
import Game = require("src/game/Game");
import GameMode = require("src/game/GameMode");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");

describe("A valid bid", function(){

    beforeEach(function(){
        Game.setup(new Deck(), [new Player(), new Player(), new Player(), new Player()]);
    })

    it("is made in the bid phase", function(){
        var bidAction = new BidAction(Game.players[0], new Bid() );

        expect(bidAction.isValid()).toEqual(false);

        Game.deal();

        expect(bidAction.isValid()).toEqual(true);
    });

    xit("is made in the current player's turn", function(){
        var bidActionPlayer1 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer2 = new BidAction(Game.players[2], new Bid());

        Game.deal();

        expect(bidActionPlayer2.isValid()).toEqual(false);

        bidActionPlayer1.execute();

        expect(bidActionPlayer2.isValid()).toEqual(true);
    })

    it("can be made only once per player", function(){
        var bidAction = new BidAction(Game.players[0], new Bid() );

        Game.deal();

        expect(bidAction.isValid()).toEqual(true);

        bidAction.execute();

        expect(bidAction.isValid()).toEqual(false);
    })

    it("can only be resolved if all 4 players have bid", function(){
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid(BidType.DEFAULT)),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid(BidType.DEFAULT)),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(BidType.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(BidType.PASS));

        Game.deal();

        Game.bidding.resolve();

        expect(Game.phase).toEqual(Phase.BID); // phase has not been changed
        expect(Game.mode).toBeUndefined();

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();

        Game.bidding.resolve();

        expect(Game.phase).toEqual(Phase.PLAY);
        expect(Game.mode).toEqual(GameMode.NORMAL);
    })

    it("is resolved to the bid type with the highest advantage", function(){
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid(BidType.DEFAULT)),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid(BidType.ABONDANCE)),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(BidType.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(BidType.PASS));

        Game.deal();

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute(); // Fourth bid, should resolve area

        expect(Game.phase).toEqual(Phase.PLAY);
        expect(Game.mode).toEqual(GameMode.ABONDANCE);
    })
})
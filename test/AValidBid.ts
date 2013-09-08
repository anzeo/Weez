/// <reference path="../def/jasmine.d.ts" />
import BidAction = require("src/bid/BidAction");
import Bid = require("src/bid/Bid");
import BidType = require("src/bid/BidType");
import Suit = require("src/card/Suit");
import Game = require("src/game/Game");
import GameMode = require("src/game/GameMode");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");

describe("A valid bid", function(){

    beforeEach(function(){
        Game.setup(new Deck(), [new Player(), new Player(), new Player(), new Player()]);
    })

    it("is made in the bid phase", function(){
        var bidAction = new BidAction(Game.players[0], new Bid(Suit.HEARTS) );

        expect(bidAction.isValid()).toEqual(false);

        Game.deal();

        expect(bidAction.isValid()).toEqual(true);
    });

    xit("is made in the current player's turn", function(){
        var bidActionPlayer1 = new BidAction(Game.players[1], new Bid(Suit.HEARTS)),
            bidActionPlayer2 = new BidAction(Game.players[2], new Bid(Suit.HEARTS) );

        Game.deal();

        expect(bidActionPlayer2.isValid()).toEqual(false);

        bidActionPlayer1.execute();

        expect(bidActionPlayer2.isValid()).toEqual(true);
    })

    it("can be made only once per player", function(){
        var bidAction = new BidAction(Game.players[0], new Bid(Suit.HEARTS) );

        Game.deal();

        expect(bidAction.isValid()).toEqual(true);

        bidAction.execute();

        expect(bidAction.isValid()).toEqual(false);
    })

    xit("is resolved to the bid type with the highest advantage", function(){
        var bidActionPlayer1 = new BidAction(Game.players[1], new Bid(Suit.HEARTS)),
            bidActionPlayer2 = new BidAction(Game.players[1], new Bid(Suit.HEARTS, BidType.ABONDANCE) );

        Game.deal();

        bidActionPlayer1.execute();
        bidActionPlayer2.execute();

        Game.bidding.resolve();

        expect(Game.mode).toEqual(GameMode.ABONDANCE);
    })
})
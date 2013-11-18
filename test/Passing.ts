/// <reference path="../def/jasmine.d.ts" />
import BidAction = require("src/action/BidAction");
import Bid = require("src/bid/Bid");
import Suit = require("src/card/Suit");
import Game = require("src/game/Game");
import Mode = require("src/game/Mode");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");

describe("A game can be passed", function(){

    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        Game.setup(deck, [new Player(), new Player(), new Player(), new Player()]);
        Game.deal();
    });

    it("in case all players have passed", function(){
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
    });
});
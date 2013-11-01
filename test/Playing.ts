/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import PlayAction = require("src/action/PlayAction");
import Player = require("src/player/Player");
import Deck = require("src/card/Deck");
import BidAction = require("src/action/BidAction");
import Bid = require("src/bid/Bid");
import Mode = require("src/game/Mode");
import Card = require("src/card/Card");
import Suit = require("src/card/Suit");

describe("If a play action is executed", function(){

    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        Game.setup(deck,[new Player(), new Player(), new Player(), new Player()]);
        Game.deal();
        var bidActionPlayer2 = new BidAction(Game.players[1], new Bid()),
            bidActionPlayer3 = new BidAction(Game.players[2], new Bid()),
            bidActionPlayer4 = new BidAction(Game.players[3], new Bid(Mode.PASS)),
            bidActionPlayer1 = new BidAction(Game.players[0], new Bid(Mode.PASS));

        bidActionPlayer2.execute();
        bidActionPlayer3.execute();
        bidActionPlayer4.execute();
        bidActionPlayer1.execute();
    });

    it("The played card is added to the table", function(){
        var player = Game.players[1],
            card = player.hand[0],
            playAction = new PlayAction(player, card);

        expect(playAction.isValid()).toBe(true);
        playAction.execute();
        expect(Game.table.entries.length).toEqual(1);
        expect(Game.table.getItemFor(player)).toEqual(card);
    });

    it("The played card is removed from the player's hand", function(){
        var player = Game.players[1],
            card = player.hand[0],
            playAction = new PlayAction(player, card);

        expect(playAction.isValid()).toBe(true);
        playAction.execute();
        expect(player.owns(card)).toBe(false);
    });

    describe("And as a result there are 4 cards on the table, the trick is resolved", function(){
        beforeEach(function(){
            Game.table.entries.push({player: Game.players[1], item: new Card(13, Suit.HEARTS)});
            Game.table.entries.push({player: Game.players[2], item: new Card(12, Suit.HEARTS)});
            Game.table.entries.push({player: Game.players[3], item: new Card(11, Suit.HEARTS)});
        });

        it("And the points are not increased in case the player scoring the tick was not an active player", function(){
            var player = Game.players[3],
                playAction = new PlayAction(player, new Card(1, Game.trump));

            spyOn(playAction, "isValid").andReturn(true);
            playAction.execute();
            // As the dealer has played the ace of trump we expect him to have a point, but he passed this round so the score should not be increased
            // TODO need to find a better way to support resolving in other modes
            // Possibly by splitting up each case of game mode in a separate file and using the same mechanism to manipulate the table
            expect(Game.scoredTicks).toEqual(0);
        });

        it("And the points are increased in case the player scoring the tick was an active player", function(){
            var player = Game.players[3],
                playAction = new PlayAction(player, new Card(2, Suit.HEARTS));

            spyOn(playAction, "isValid").andReturn(true);
            playAction.execute();
            // First player scored the tick, so score should be increased
            // TODO need to find a better way to support resolving in other modes
            // Possibly by splitting up each case of game mode in a separate file and using the same mechanism to manipulate the table
            expect(Game.scoredTicks).toEqual(1);
        });

        it("And the table is cleared", function(){
            var player = Game.players[3],
                playAction = new PlayAction(player, new Card(2, Suit.HEARTS));

            spyOn(playAction, "isValid").andReturn(true);
            playAction.execute();

            expect(Game.table.isEmpty()).toEqual(true);
        });
    })
});
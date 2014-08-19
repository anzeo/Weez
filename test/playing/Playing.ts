/// <reference path="../../def/jasmine.d.ts" />
import Weez = require("../../src/Weez");
import Player = require("../../src/player/Player");
import ActionFactory = require("../../src/action/ActionFactory");
import Mode = require("../../src/game/Mode");
import Card = require("../../src/card/Card");
import Suit = require("../../src/card/Suit");

describe("If a play action is executed", function(){

    var game;
    beforeEach(function(){
        game = Weez.getGame(Weez.createGame());
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.deal();

        ActionFactory.createNormalBidAction(game, game.players[1]).execute();
        ActionFactory.createNormalBidAction(game, game.players[2]).execute();
        ActionFactory.createPassBidAction(game, game.players[3]).execute();
        ActionFactory.createPassBidAction(game, game.players[0]).execute();
    });

    it("The played card is added to the table", function(){
        var player = game.players[1],
            card = player.hand[0],
            playAction = ActionFactory.createPlayAction(game, player, card);

        expect(playAction.isValid()).toBe(true);
        playAction.execute();
        expect(game.table.entries.length).toEqual(1);
        expect(game.table.getItemFor(player)).toEqual(card);
    });

    it("The played card is removed from the player's hand", function(){
        var player = game.players[1],
            card = player.hand[0],
            playAction = ActionFactory.createPlayAction(game,player, card);

        expect(playAction.isValid()).toBe(true);
        playAction.execute();
        expect(player.owns(card)).toBe(false);
    });

    describe("And as a result there are 4 cards on the table, the trick is resolved", function(){
        beforeEach(function(){
            game.table.entries.push({player: game.players[1], item: new Card(9, Suit.HEARTS)});
            game.table.entries.push({player: game.players[2], item: new Card(10, Suit.HEARTS)});
            game.table.entries.push({player: game.players[3], item: new Card(8, Suit.HEARTS)});
        });

        it("And the points are not increased in case the player scoring the tick was not an active player", function(){
            var player = game.players[0],
                playAction = ActionFactory.createPlayAction(game,player, new Card(1, game.trump));

            spyOn(playAction, "isValid").andReturn(true);
            playAction.execute();
            // As the dealer has played the ace of trump we expect him to have a point, but he passed this round so the score should not be increased
            // TODO need to find a better way to support resolving in other modes
            // Possibly by splitting up each case of game mode in a separate file and using the same mechanism to manipulate the table
            expect(game.scoredTricks).toEqual(0);
        });

        it("And the points are increased in case the player scoring the tick was an active player", function(){
            var player = game.players[0],
                playAction = ActionFactory.createPlayAction(game,player, new Card(2, Suit.HEARTS));

            spyOn(playAction, "isValid").andReturn(true);
            playAction.execute();
            // First player scored the tick, so score should be increased
            // TODO need to find a better way to support resolving in other modes
            // Possibly by splitting up each case of game mode in a separate file and using the same mechanism to manipulate the table
            expect(game.scoredTricks).toEqual(1);
        });

        it("And the table is cleared", function(){
            var player = game.players[0],
                playAction = ActionFactory.createPlayAction(game,player, new Card(2, Suit.HEARTS));

            spyOn(playAction, "isValid").andReturn(true);
            playAction.execute();

            expect(game.table.isEmpty()).toEqual(true);
        });

        it("And the player who wins the trick is the new current player", function(){
            var player = game.players[0],
                playAction = ActionFactory.createPlayAction(game,player, new Card(2, Suit.HEARTS));

            spyOn(playAction, "isValid").andReturn(true);
            playAction.execute();

            expect(game.currentPlayer).toEqual(game.players[2]);
        });
    })
});
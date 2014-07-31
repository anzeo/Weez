/// <reference path="../../def/jasmine.d.ts" />
import Weez = require("../../src/Weez");
import Deck = require("../../src/card/Deck");
import Player = require("../../src/player/Player");
import Phase = require("../../src/game/Phase");
import ActionFactory = require("../../src/action/ActionFactory");
import Mode = require("../../src/game/Mode");
import Card = require("../../src/card/Card");
import Suit = require("../../src/card/Suit");
import DefaultCalculator = require("../../src/calculator/DefaultCalculator");

describe("A game is scored", function(){

    var game;
    beforeEach(function(){
        game = Weez.createGame();
        game.players = [new Player(), new Player(), new Player(), new Player()];
        game.calculator = new DefaultCalculator();
    });

    it("after all cards have been played", function(){
        // mock phase & mode
        game.phase = Phase.PLAY;

        // mock active players
        game.activePlayers = [game.players[0]];

        // mock game is in final turn
        var lastTrick = game.deck.cards.slice(0,4);
        game.deck.cards.splice(0,4);

        // play each action, spy to be valid
        for(var i = 0; i < 4; i++){
            var action = ActionFactory.createPlayAction(game,game.players[i], lastTrick[i]);
            spyOn(action, "isValid").andReturn(true);
            action.execute();
        }

        // after fourth play, round has finished as well as the game
        expect(game.phase).toEqual(Phase.SCORE);
    });

    describe("when the game is in misery mode and", function(){
        beforeEach(function(){
            game.deal();

            // mock phase & mode
            game.phase = Phase.PLAY;
            game.mode = Mode.MISERY;
        });

        it("and the active player has scored at least one trick", function(){
            // mock active player and mock he has already scored a trick
            game.activePlayers = [game.players[0]];
            game.players[0].hasScoredTricks = true;

            // now the game should end after the next round has finished
            for(var i = 0; i < 4; i++){
                var action = ActionFactory.createPlayAction(game,game.players[i], game.players[i].hand[0]);

                spyOn(action, "isValid").andReturn(true);
                action.execute();
            }

            expect(game.phase).toEqual(Phase.SCORE);
        });

        it("all active players have scored at least one trick", function(){
            // mock active player and mock he has already scored a trick
            game.activePlayers = [game.players[0], game.players[1], game.players[3]];
            game.players[0].hasScoredTricks = true;

            // the game should only finish if ALL active players have scored at least a trick
            for(var i = 0; i < 4; i++){
                var action = ActionFactory.createPlayAction(game,game.players[i], game.players[i].hand[0]);

                spyOn(action, "isValid").andReturn(true);
                action.execute();

                // force player 2 to have scored no tricks
                game.players[1].hasScoredTricks = false;
            }

            expect(game.phase).toEqual(Phase.PLAY);

            // now force second active player to have scored a trick
            game.players[1].hasScoredTricks = true;
            game.players[3].hasScoredTricks = true;

            // the game should only finish if ALL active players have scored at least a trick
            for(var i = 0; i < 4; i++){
                var action = ActionFactory.createPlayAction(game,game.players[i], game.players[i].hand[0]);

                spyOn(action, "isValid").andReturn(true);
                action.execute();
            }

            expect(game.phase).toEqual(Phase.SCORE);
        });
    });

    describe("when the game is in solo mode", function(){
        it("and the active player misses a trick", function(){
            game.deal();

            // mock phase & mode
            game.phase = Phase.PLAY;
            game.mode = Mode.SOLO;

            game.activePlayers = [game.players[0]];

            // mock player's actions
            var player2Action = ActionFactory.createPlayAction(game,game.players[1], new Card(1, game.defaultTrump));
            var player3Action = ActionFactory.createPlayAction(game,game.players[2], new Card(2, game.defaultTrump));
            var player4Action = ActionFactory.createPlayAction(game,game.players[3], new Card(3, game.defaultTrump));
            var player1Action = ActionFactory.createPlayAction(game,game.players[0], new Card(4, game.defaultTrump));

            spyOn(player1Action, "isValid").andReturn(true);
            spyOn(player2Action, "isValid").andReturn(true);
            spyOn(player3Action, "isValid").andReturn(true);
            spyOn(player4Action, "isValid").andReturn(true);

            player2Action.execute();
            player3Action.execute();
            player4Action.execute();
            player1Action.execute();

            expect(game.phase).toEqual(Phase.SCORE);
        });
    });
});


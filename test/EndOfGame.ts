/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");
import PlayAction = require("src/action/PlayAction");
import Mode = require("src/game/Mode");

describe("A game is scored", function(){
    it("after all cards have been played", function(){
        var  deck = new Deck();
        deck.shuffle();
        Game.setup(deck,[new Player(), new Player(),new Player(),new Player()]);
        // mock phase & mode
        Game.phase = Phase.PLAY;

        // mock active players
        Game.activePlayers = [Game.players[0]];

        // mock game is in final turn
        var lastTrick = deck.cards.slice(0,4);

        // play each action, spy to be valid
        for(var i = 0; i < 4; i++){
            var action = new PlayAction(Game.players[i], lastTrick[i]);

            spyOn(action, "isValid").andReturn(true);
            action.execute();
        }

        // after fourth play, round has finished as well as the game
        expect(Game.phase).toEqual(Phase.SCORE);
    });

    describe("when the game is in misery mode and", function(){

        beforeEach(function(){
            var  deck = new Deck();
            deck.shuffle();
            Game.setup(deck,[new Player(), new Player(),new Player(),new Player()]);

            Game.deal();

            // mock phase & mode
            Game.phase = Phase.PLAY;
            Game.mode = Mode.MISERY;
        });

        it("and the active player has scored at least one trick", function(){
            // mock active player and mock he has already scored a trick
            Game.activePlayers = [Game.players[0]];
            Game.players[0].hasScoredTricks = true;

            // now the game should end after the next round has finished
            for(var i = 0; i < 4; i++){
                var action = new PlayAction(Game.players[i], Game.players[i].hand[0]);

                spyOn(action, "isValid").andReturn(true);
                action.execute();
            }

            expect(Game.phase).toEqual(Phase.SCORE);
        });

        it("all active players have scored at least one trick", function(){
            // mock active player and mock he has already scored a trick
            Game.activePlayers = [Game.players[0], Game.players[1], Game.players[3]];
            Game.players[0].hasScoredTricks = true;

            // the game should only finish if ALL active players have scored at least a trick
            for(var i = 0; i < 4; i++){
                var action = new PlayAction(Game.players[i], Game.players[i].hand[0]);

                spyOn(action, "isValid").andReturn(true);
                action.execute();

                // force player 2 to have scored no tricks
                Game.players[1].hasScoredTricks = false;
            }

            expect(Game.phase).toEqual(Phase.PLAY);

            // now force second active player to have scored a trick
            Game.players[1].hasScoredTricks = true;
            Game.players[3].hasScoredTricks = true;

            // the game should only finish if ALL active players have scored at least a trick
            for(var i = 0; i < 4; i++){
                var action = new PlayAction(Game.players[i], Game.players[i].hand[0]);

                spyOn(action, "isValid").andReturn(true);
                action.execute();
            }

            expect(Game.phase).toEqual(Phase.SCORE);
        });
    })
});


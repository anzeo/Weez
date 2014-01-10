/// <reference path="../def/jasmine.d.ts" />
import Weez = require("src/Weez");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");
import Mode = require("src/game/Mode");
import Suit = require("src/card/Suit");
import MiseryCalculator = require("src/calculator/MiseryCalculator");

describe("Players are assigned a score after a misery game", function(){

    var game;
    beforeEach(function(){
        game = Weez.createGame([new Player(), new Player(),new Player(),new Player()]);
        // mock phase
        game.phase = Phase.PLAY;
        game.target = 0;
        game.mode = Mode.MISERY;
        game.calculator = new MiseryCalculator();
    });

    describe("When there is 1 active player", function(){

        beforeEach(function(){
            game.activePlayers = [game.players[0]];
        });

        it("he gains 15 points for achieving the target", function(){
            game.scoredTricks = 0;
            game.score();

            playersScoreEquals([15,-5,-5,-5]);
        });

        it("He loses 15 points for not achieving the target", function(){
            game.activePlayers[0].hasScoredTricks = true;
            game.score();

            playersScoreEquals([-15,5,5,5]);
        });
    });

    describe("When there are 2 active players", function(){
        beforeEach(function(){
            game.activePlayers = [game.players[0], game.players[1]];
        });

        it("And both win, they are awarded 5 points each", function(){
            game.score();

            playersScoreEquals([5,5,-5,-5]);
        });

        it("And both lose, they lose 5 points each", function(){
            game.players[0].hasScoredTricks = true;
            game.players[1].hasScoredTricks = true;
            game.score();

            playersScoreEquals([-5,-5,5,5]);
        });

        it("And only one wins, he gets 5 points from the second active player. The other players score does not change.", function(){
            game.scoredTricks = 1;
            game.players[0].hasScoredTricks = true;
            game.score();

            playersScoreEquals([-5,5,0,0]);
        });
    });

    describe("When there are 3 active players", function(){
        beforeEach(function(){
            game.activePlayers = [game.players[0], game.players[1], game.players[2]];
        });

        it("And all win, they are awarded 5 points each", function(){
            game.score();

            playersScoreEquals([5,5,5,-15]);
        });

        it("And two win, they get 5 points each while the other active player loses 10 points.", function(){
            game.players[0].hasScoredTricks = true;
            game.score();

            playersScoreEquals([-10,5,5,0]);
        });

        it("And only one wins, he gets 10 points, while the other active players lose 5 points each", function(){
            game.players[0].hasScoredTricks = true;
            game.players[1].hasScoredTricks = true;
            game.score();

            playersScoreEquals([-5,-5,10,0]);
        });

        it("And all loose, they all lose 5 points", function(){
            game.players[0].hasScoredTricks = true;
            game.players[1].hasScoredTricks = true;
            game.players[2].hasScoredTricks = true;
            game.score();

            playersScoreEquals([-5,-5,-5,15]);
        });
    });

    describe("When there are 4 active players", function(){
        beforeEach(function(){
            game.activePlayers = [game.players[0], game.players[1], game.players[2], game.players[3]];
        });

        it("And three win, the other loses 15 points", function(){
            game.players[0].hasScoredTricks = true;
            game.score();

            playersScoreEquals([-15,5,5,5]);
        });

        it("And two win, they get 5 points each while the other active players lose 5 points each.", function(){
            game.players[0].hasScoredTricks = true;
            game.players[1].hasScoredTricks = true;
            game.score();

            playersScoreEquals([-5,-5,5,5]);
        });

        it("And only one wins, he gets 15 points, while the other active players lose 5 points each", function(){
            game.players[0].hasScoredTricks = true;
            game.players[1].hasScoredTricks = true;
            game.players[3].hasScoredTricks = true;
            game.score();

            playersScoreEquals([-5,-5,15,-5]);
        });

        it("And all loose, nothing happens", function(){
            game.players[0].hasScoredTricks = true;
            game.players[1].hasScoredTricks = true;
            game.players[2].hasScoredTricks = true;
            game.players[3].hasScoredTricks = true;
            game.score();

            playersScoreEquals([0,0,0,0]);
        });
    });

    function playersScoreEquals(scores): void {
        for(var i = 0; i < 4; i++){
            expect(game.players[i].score).toEqual(scores[i]);
        }
    }
});
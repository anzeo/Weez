/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");
import Mode = require("src/game/Mode");
import Suit = require("src/card/Suit");
import MiseryCalculator = require("src/calculator/MiseryCalculator");

describe("Players are assigned a score after a misery game", function(){

    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        Game.setup(deck,[new Player(), new Player(),new Player(),new Player()]);
        // mock phase
        Game.phase = Phase.PLAY;
        Game.target = 0;
        Game.mode = Mode.MISERY;
        Game.calculator = new MiseryCalculator();
    });

    describe("When there is 1 active player", function(){

        beforeEach(function(){
            Game.activePlayers = [Game.players[0]];
        });

        it("he gains 15 points for achieving the target", function(){
            Game.scoredTicks = 0;
            Game.score();

            playersScoreEquals([15,-5,-5,-5]);
        });

        it("He loses 15 points for not achieving the target", function(){
            Game.activePlayers[0].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([-15,5,5,5]);
        });
    });

    describe("When there are 2 active players", function(){
        beforeEach(function(){
            Game.activePlayers = [Game.players[0], Game.players[1]];
        });

        it("And both win, they are awarded 5 points each", function(){
            Game.score();

            playersScoreEquals([5,5,-5,-5]);
        });

        it("And both lose, they lose 5 points each", function(){
            Game.players[0].hasScoredTricks = true;
            Game.players[1].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([-5,-5,5,5]);
        });

        it("And only one wins, he gets 5 points from the second active player. The other players score does not change.", function(){
            Game.scoredTicks = 1;
            Game.players[0].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([-5,5,0,0]);
        });
    });

    describe("When there are 3 active players", function(){
        beforeEach(function(){
            Game.activePlayers = [Game.players[0], Game.players[1], Game.players[2]];
        });

        it("And all win, they are awarded 5 points each", function(){
            Game.score();

            playersScoreEquals([5,5,5,-15]);
        });

        it("And two win, they get 5 points each while the other active player loses 10 points.", function(){
            Game.players[0].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([-10,5,5,0]);
        });

        it("And only one wins, he gets 10 points, while the other active players lose 5 points each", function(){
            Game.players[0].hasScoredTricks = true;
            Game.players[1].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([-5,-5,10,0]);
        });

        it("And all loose, they all lose 5 points", function(){
            Game.players[0].hasScoredTricks = true;
            Game.players[1].hasScoredTricks = true;
            Game.players[2].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([-5,-5,-5,15]);
        });
    });

    describe("When there are 4 active players", function(){
        beforeEach(function(){
            Game.activePlayers = [Game.players[0], Game.players[1], Game.players[2], Game.players[3]];
        });

        it("And three win, the other loses 15 points", function(){
            Game.players[0].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([-15,5,5,5]);
        });

        it("And two win, they get 5 points each while the other active players lose 5 points each.", function(){
            Game.players[0].hasScoredTricks = true;
            Game.players[1].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([-5,-5,5,5]);
        });

        it("And only one wins, he gets 15 points, while the other active players lose 5 points each", function(){
            Game.players[0].hasScoredTricks = true;
            Game.players[1].hasScoredTricks = true;
            Game.players[3].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([-5,-5,15,-5]);
        });

        it("And all loose, nothing happens", function(){
            Game.players[0].hasScoredTricks = true;
            Game.players[1].hasScoredTricks = true;
            Game.players[2].hasScoredTricks = true;
            Game.players[3].hasScoredTricks = true;
            Game.score();

            playersScoreEquals([0,0,0,0]);
        });
    });

    function playersScoreEquals(scores): void {
        for(var i = 0; i < 4; i++){
            expect(Game.players[i].score).toEqual(scores[i]);
        }
    }
});
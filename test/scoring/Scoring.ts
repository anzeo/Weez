/// <reference path="../../def/jasmine.d.ts" />
import Weez = require("../../src/Weez");
import Player = require("../../src/player/Player");
import Phase = require("../../src/game/Phase");
import Mode = require("../../src/game/Mode");
import DefaultCalculator = require("../../src/calculator/DefaultCalculator");

describe("Players are assigned a score", function(){

    var game;
    beforeEach(function(){
        game = Weez.getGame(Weez.createGame());
        game.players = [new Player(), new Player(), new Player(), new Player()];
        // mock phase & mode
        game.mode = Mode.NORMAL;
        game.phase = Phase.PLAY;

        game.calculator = new DefaultCalculator();
    });

    describe("When there's only one active player", function(){

        beforeEach(function(){
            game.activePlayers = [game.players[0]];
            game.target = 5;
        });

        it("He gains extra points for each scored trick above target", function(){
            game.scoredTricks = 7;
            game.score();

            expect(game.players[0].score).toEqual(12);
            expect(totalScoreEqualsZero()).toEqual(true);
        });

        it("He gains 6 points for scoring exactly the target amount of tricks", function(){
            game.scoredTricks = 5;
            game.score();

            expect(game.players[0].score).toEqual(6);
            expect(totalScoreEqualsZero()).toEqual(true);
        });

        it("He loses extra points for each scored trick under target", function(){
            game.scoredTricks = 3;
            game.score();

            expect(game.players[0].score).toEqual(-12);
            expect(totalScoreEqualsZero()).toEqual(true);
        });
    });

    describe("When there are 2 active players", function(){

        beforeEach(function(){
            game.activePlayers = [game.players[0], game.players[1]];
            game.target = 8;
        });

        it("They gain extra points for each scored trick above target", function(){
            game.scoredTricks = game.target + 2;
            game.score();

            expect(game.players[0].score).toEqual(4);
            expect(totalScoreEqualsZero()).toEqual(true);
        });

        it("They gain 2 points each for scoring exactly the target amount of tricks", function(){
            game.scoredTricks = game.target;
            game.score();

            expect(game.players[0].score).toEqual(2);
            expect(game.players[1].score).toEqual(2);
            expect(totalScoreEqualsZero()).toEqual(true);
        });

        it("They each lose extra points for each scored trick under target", function(){
            game.scoredTricks = game.target - 2;
            game.score();

            expect(game.players[0].score).toEqual(-4);
            expect(game.players[1].score).toEqual(-4);
            expect(totalScoreEqualsZero()).toEqual(true);
        });
    });

    function totalScoreEqualsZero(): boolean {
        var score = 0;
        for(var i = 0; i < 4; i++){
            score += game.players[i].score;
        }
        return score === 0;
    }
});
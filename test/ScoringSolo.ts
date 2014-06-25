/// <reference path="../def/jasmine.d.ts" />
import Weez = require("../src/Weez");
import Player = require("../src/player/Player");
import Phase = require("../src/game/Phase");
import Mode = require("../src/game/Mode");
import Suit = require("../src/card/Suit");
import SoloCalculator = require("../src/calculator/SoloCalculator");

describe("Players are assigned a score after a solo game", function(){

    var game;
    beforeEach(function(){
        game = Weez.createGame([new Player(), new Player(),new Player(),new Player()]);
        // mock phase
        game.phase = Phase.PLAY;
        game.activePlayers = [game.players[0]];
        game.target = 13;
        game.mode = Mode.SOLO;
        game.defaultTrump = Suit.SPADES;
        game.calculator = new SoloCalculator();
    });

    it("And the active player gains 45 points for achieving the target when his choice of suit was different than the default trump", function(){
        game.scoredTricks = 13;
        game.trump = Suit.CLUBS;
        game.score();

        expect(game.players[0].score).toEqual(45);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active player loses 45 points for not achieving the target when his choice of suit was different than the default trump", function(){
        game.scoredTricks = 12;
        game.trump = Suit.CLUBS;
        game.score();

        expect(game.players[0].score).toEqual(-45);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active player gains 90 points for achieving the target when his choice of suit was the default trump", function(){
        game.scoredTricks = 13;
        game.trump = game.defaultTrump;
        game.score();

        expect(game.players[0].score).toEqual(90);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active player loses 90 points for not achieving the target when his choice of suit was the default trump", function(){
        game.scoredTricks = 12;
        game.trump = game.defaultTrump;
        game.score();

        expect(game.players[0].score).toEqual(-90);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    function totalScoreEqualsZero(): boolean {
        var score = 0;
        for(var i = 0; i < 4; i++){
            score += game.players[i].score;
        }
        return score === 0;
    }
});
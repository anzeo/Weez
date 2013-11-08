/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");

describe("Players are assigned a score", function(){

    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        Game.setup(deck,[new Player(), new Player(),new Player(),new Player()]);
        // mock phase
        Game.phase = Phase.PLAY;
    });

    it("And the active player gains extra points for each scored trick above target", function(){
        Game.activePlayers = [Game.players[0]];
        Game.target = 5;
        Game.scoredTicks = 7;
        Game.score();

        expect(Game.players[0].score).toEqual(12);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active player gains 6 points for scoring exactly the target amount of tricks", function(){
        Game.activePlayers = [Game.players[0]];
        Game.target = 5;
        Game.scoredTicks = 5;
        Game.score();

        expect(Game.players[0].score).toEqual(6);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active player loses extra points for each scored trick under target", function(){
        Game.activePlayers = [Game.players[0]];
        Game.target = 5;
        Game.scoredTicks = 3;
        Game.score();

        expect(Game.players[0].score).toEqual(-12);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active players gain extra points for each scored trick above target", function(){
        Game.activePlayers = [Game.players[0], Game.players[1]];
        Game.target = 8;
        Game.scoredTicks = Game.target + 2;
        Game.score();

        expect(Game.players[0].score).toEqual(4);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active players gain 2 points for scoring exactly the target amount of tricks", function(){
        Game.activePlayers = [Game.players[0], Game.players[1]];
        Game.target = 8;
        Game.scoredTicks = Game.target;
        Game.score();

        expect(Game.players[0].score).toEqual(2);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active players lose extra points for each scored trick under target", function(){
        Game.activePlayers = [Game.players[0],Game.players[1]];
        Game.target = 8;
        Game.scoredTicks = Game.target - 2;
        Game.score();

        expect(Game.players[0].score).toEqual(-4);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    function totalScoreEqualsZero(): boolean {
        var score = 0;
        for(var i = 0; i < 4; i++){
            score += Game.players[i].score;
        }
        return score === 0;
    }
});
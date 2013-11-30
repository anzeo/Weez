/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");
import Mode = require("src/game/Mode");
import Suit = require("src/card/Suit");
import SoloCalculator = require("src/calculator/SoloCalculator");

describe("Players are assigned a score after a solo game", function(){

    beforeEach(function(){
        var deck = new Deck();
        deck.shuffle();
        Game.setup(deck,[new Player(), new Player(),new Player(),new Player()]);
        // mock phase
        Game.phase = Phase.PLAY;
        Game.activePlayers = [Game.players[0]];
        Game.target = 13;
        Game.mode = Mode.SOLO;
        Game.defaultTrump = Suit.SPADES;
        Game.calculator = new SoloCalculator();
    });

    it("And the active player gains 45 points for achieving the target when his choice of suit was different than the default trump", function(){
        Game.scoredTicks = 13;
        Game.trump = Suit.CLUBS;
        Game.score();

        expect(Game.players[0].score).toEqual(45);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active player loses 45 points for not achieving the target when his choice of suit was different than the default trump", function(){
        Game.scoredTicks = 12;
        Game.trump = Suit.CLUBS;
        Game.score();

        expect(Game.players[0].score).toEqual(-45);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active player gains 90 points for achieving the target when his choice of suit was the default trump", function(){
        Game.scoredTicks = 13;
        Game.trump = Game.defaultTrump;
        Game.score();

        expect(Game.players[0].score).toEqual(90);
        expect(totalScoreEqualsZero()).toEqual(true);
    });

    it("And the active player loses 90 points for not achieving the target when his choice of suit was the default trump", function(){
        Game.scoredTicks = 12;
        Game.trump = Game.defaultTrump;
        Game.score();

        expect(Game.players[0].score).toEqual(-90);
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
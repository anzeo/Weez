/// <reference path="../def/jasmine.d.ts" />
import Game = require("src/game/Game");
import Deck = require("src/card/Deck");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");
import PlayAction = require("src/action/PlayAction");

describe("A game is scored", function(){
    it("after all cards have been played", function(){
        var  deck = new Deck();
        deck.shuffle();
        Game.setup(deck,[new Player(), new Player(),new Player(),new Player()]);
        // mock phase
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
});


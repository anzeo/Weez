/// <reference path="../def/jasmine.d.ts" />
import Weez = require("../src/Weez");
import Mode = require("../src/game/Mode");
import Player = require("../src/player/Player");
import Card = require("../src/card/Card");
import Suit = require("../src/card/Suit");
import Phase = require("../src/game/Phase");

describe("A play action is valid", function(){

    var game;
    beforeEach(function(){
        game = Weez.createGame([new Player(), new Player(), new Player(), new Player()]);
        game.deal();

        Weez.bid(game.players[1]);
        Weez.bid(game.players[2]);
        Weez.pass(game.players[3]);
        Weez.pass(game.players[0]);
    });

    it("If the game is in the play phase", function(){
        game.phase = Phase.BID;
        expect(Weez.play(game.players[1], game.players[1].hand[0])).toEqual(false);
        game.phase = Phase.PLAY;
        expect(Weez.play(game.players[1], game.players[1].hand[0])).toEqual(true);
    });

    it("If the player is the active player", function(){
        var player3 = game.players[2];

        expect(Weez.play(player3, player3.hand[0])).toEqual(false);

        Weez.play(game.players[1], game.players[1].hand[0]);

        spyOn(player3, "hasCardsOfSuit").andReturn(false);

        expect(Weez.play(player3, player3.hand[0])).toEqual(true);
    });

    it("If the player owns the card", function(){
        expect(Weez.play(game.players[1], game.players[0].hand[0])).toEqual(false);
        expect(Weez.play(game.players[1], game.players[1].hand[0])).toEqual(true);
    });

    it("If the played card has the same trump as the first card played in the round", function(){
        var player2 = game.players[1],
            player3 = game.players[2],
            cardPlayedBy2 = new Card(1, Suit.HEARTS),
            validCardPlayedBy3 = new Card(2, Suit.HEARTS),
            invalidCardPlayedBy3 = new Card(1,Suit.CLUBS);

        spyOn(player2, "owns").andReturn(true);
        spyOn(player3, "owns").andReturn(true);
        spyOn(player3, "hasCardsOfSuit").andReturn(true); // make sure playing a card of another suit will fail the test

        Weez.play(player2,cardPlayedBy2);
        expect(Weez.play(player3,invalidCardPlayedBy3)).toEqual(false);
        expect(Weez.play(player3,validCardPlayedBy3)).toEqual(true);
    });

    it("If the played card has another suit as the first card of the round, but the player has no cards left of that trump in his hand", function(){
        var player2 = game.players[1],
            player3 = game.players[2],
            cardPlayedBy2 = new Card(1,Suit.HEARTS),
            cardPlayedBy3 = new Card(1,Suit.CLUBS);

        player2.hand = [cardPlayedBy2];
        player3.hand = [cardPlayedBy3];

        Weez.play(player2,cardPlayedBy2);
        expect(Weez.play(player3,cardPlayedBy3)).toEqual(true);
    });
});
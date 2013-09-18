/// <reference path="../def/jasmine.d.ts" />
import Player = require("src/player/Player");
import Card = require("src/card/Card");
import Suit = require("src/card/Suit");

describe("A player", function(){

    var player,
        card;

    beforeEach(function(){
        player = new Player();
        card = new Card(1, Suit.CLUBS);
    })

    it("can be dealt cards", function(){
        player.deal([]);
        expect(player.hand.length).toEqual(0);

        player.deal([card]);
        expect(player.hand.length).toEqual(1);
    })

    it("can check if he owns a specific card", function(){
        expect(player.owns(card)).toEqual(false);

        player.deal([card]);

        expect(player.owns(card)).toEqual(true);
    })

    it("can check if he owns cards of a specific suit", function(){
        var card2 = new Card(1, Suit.DIAMONDS);
        expect(player.hasCardsOfSuit(Suit.CLUBS)).toEqual(false);
        player.deal([card2]);
        expect(player.hasCardsOfSuit(Suit.CLUBS)).toEqual(false);
        player.deal([card]);
        expect(player.hasCardsOfSuit(Suit.CLUBS)).toEqual(true);
        expect(player.hasCardsOfSuit(Suit.HEARTS)).toEqual(false);
    })
})
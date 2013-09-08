/// <reference path="../def/jasmine.d.ts" />
import Card = require("src/card/Card");
import Suit = require("src/card/Suit");

describe("A card", function(){
    it("has a value", function(){
        var card = new Card(13, Suit.HEARTS);
        expect(card.value).toEqual(13);
    })

    it("has a suit", function(){
        var card = new Card(13, Suit.HEARTS);
        expect(card.suit).toEqual(Suit.HEARTS);
    })

    /*it("has a string representation", function(){
        var card = new Card(13, Suit.Hearts);
        expect(card.toString()).toEqual("King of Hearts");
    })

    it("has a short string representation", function(){
        var card = new Card(13, Suit.Hearts);
        expect(card.toShortString()).toEqual("K♥");
    })*/
})
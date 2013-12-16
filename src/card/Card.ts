import Suit = require("src/card/Suit");

class Card {
    constructor(public value: number,public suit: Suit){}

    toString(){
        return this.value + " " + Suit[this.suit];
    }
}

export = Card;
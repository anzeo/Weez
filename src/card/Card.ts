import Suit = require("src/card/Suit");

class Card {
    constructor(public value: number,public suit: Suit){}
}

export = Card;
import Suit = require("src/card/Suit");

class Card {
    value: number;
    suit: Suit;

    constructor(value: number, suit: Suit){
        this.value = value;
        this.suit = suit;
    }
}

export = Card;
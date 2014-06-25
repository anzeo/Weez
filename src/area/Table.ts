import Area = require("Area");
import Card = require("../card/Card");
import Suit = require("../card/Suit");

class Table extends Area<Card> {
    getSuitOfCard(i: number): Suit{
        return this.entries[i].item.suit;
    }
}

export = Table;

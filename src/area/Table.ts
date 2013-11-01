import Area = require("src/area/Area");
import Card = require("src/card/Card");
import Suit = require("src/card/Suit");

class Table extends Area<Card> {
    trump: Suit;

    setTrump(trump: Suit){
        this.trump = trump;
    }

    getSuitOfCard(i: number): Suit{
        return this.entries[i].item.suit;
    }
}

export = Table;

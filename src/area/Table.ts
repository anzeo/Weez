import Area = require("src/area/Area");
import Card = require("src/card/Card");
import Suit = require("src/card/Suit");

class Table extends Area<Card> {
    trump: Suit;

    setTrump(trump: Suit){
        this.trump = trump;
    }
}

export = Table;

import Suit = require("src/card/Suit");
import Mode = require("src/game/Mode");

class Bid {
    constructor(public mode: Mode = Mode.NORMAL, public suit?: Suit){
        this.suit = mode !== Mode.PASS ? suit : undefined;
    }
}

export = Bid;
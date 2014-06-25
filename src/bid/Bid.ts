import Suit = require("../card/Suit");
import Mode = require("../game/Mode");

class Bid {
    constructor(public mode: Mode, public suit?: Suit){
        this.suit = mode !== Mode.PASS ? suit : undefined;
    }
}

export = Bid;
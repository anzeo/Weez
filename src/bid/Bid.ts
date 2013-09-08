import Suit = require("src/card/Suit");
import BidType = require("src/bid/BidType");

class Bid {
    constructor(public suit: Suit, public bidType?: BidType){

    }
}

export = Bid;
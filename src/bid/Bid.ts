import Suit = require("src/card/Suit");
import BidType = require("src/bid/BidType");
import Game = require("src/game/Game");

class Bid {
    constructor(public bidType?: BidType, public suit?: Suit){
        this.bidType = bidType || BidType.DEFAULT;
        if(bidType !== BidType.PASS)
            this.suit = suit || Game.defaultTrump;
    }
}

export = Bid;
import BidAction = require("src/action/BidAction");
import Player = require("src/player/Player");
import Suit = require("src/card/Suit");
import Mode = require("src/game/Mode");
import Bid = require("src/bid/Bid");

class AbondanceBidAction extends BidAction {

    constructor(player:Player, suit:Suit){
        super(player, new Bid(Mode.ABONDANCE, suit))
    }
}

export = AbondanceBidAction;
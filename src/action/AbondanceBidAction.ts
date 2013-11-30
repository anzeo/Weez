import BidAction = require("src/action/BidAction");
import Player = require("src/player/Player");
import Suit = require("src/card/Suit");
import Mode = require("src/game/Mode");
import Bid = require("src/bid/Bid");

import Game = require("src/game/Game");

class AbondanceBidAction extends BidAction {

    constructor(player:Player, suit:Suit){
        super(player, new Bid(Mode.ABONDANCE, suit))
    }

    moreActivePlayersAreAllowed(){
        return Game.bidding.activePlayers.length < 1;
    }

    getTarget(){
        return 9;
    }
}

export = AbondanceBidAction;
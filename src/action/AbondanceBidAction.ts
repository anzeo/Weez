import BidAction = require("src/action/BidAction");
import Player = require("src/player/Player");
import Suit = require("src/card/Suit");
import Mode = require("src/game/Mode");
import Bid = require("src/bid/Bid");

import Game = require("src/game/Game");

class AbondanceBidAction extends BidAction {

    constructor(game:Game,player:Player, suit:Suit){
        super(game,player, new Bid(Mode.ABONDANCE, suit))
    }

    moreActivePlayersAreAllowed(){
        return this.game.bidding.activePlayers.length < 1;
    }

    getTarget(){
        return 9;
    }
}

export = AbondanceBidAction;
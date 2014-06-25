import BidAction = require("BidAction");
import Player = require("../player/Player");
import Suit = require("../card/Suit");
import Mode = require("../game/Mode");
import Bid = require("../bid/Bid");
import Game = require("../game/Game");

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
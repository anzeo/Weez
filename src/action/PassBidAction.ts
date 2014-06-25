import BidAction = require("BidAction");
import Player = require("../player/Player");
import Bid = require("../bid/Bid");
import Mode = require("../game/Mode");
import Game = require("../game/Game");

class PassBidAction extends BidAction {
    constructor(game:Game,player: Player){
        super(game, player, new Bid(Mode.PASS));
    }

    moreActivePlayersAreAllowed(){
        return true;
    }

    getTarget(){
        return 0;
    }
}

export = PassBidAction;
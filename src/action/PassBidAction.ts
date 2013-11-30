import BidAction = require("src/action/BidAction");
import Player = require("src/player/Player");
import Bid = require("src/bid/Bid");
import Mode = require("src/game/Mode");

class PassBidAction extends BidAction {
    constructor(player: Player){
        super(player, new Bid(Mode.PASS));
    }

    moreActivePlayersAreAllowed(){
        return true;
    }

    getTarget(){
        return 0;
    }
}

export = PassBidAction;
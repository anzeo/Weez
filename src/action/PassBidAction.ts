import BidAction = require("src/action/BidAction");
import Player = require("src/player/Player");
import Bid = require("src/bid/Bid");
import Mode = require("src/game/Mode");
import Game = require("src/game/Game");

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
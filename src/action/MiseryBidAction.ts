import BidAction = require("src/action/BidAction");
import Player = require("src/player/Player");
import Bid = require("src/bid/Bid");
import Mode = require("src/game/Mode");
import MiseryCalculator = require("src/calculator/MiseryCalculator");
import Game = require("src/game/Game");

class MiseryBidAction extends BidAction {
    constructor(game:Game,player: Player){
        super(game,player, new Bid(Mode.MISERY));
    }

    moreActivePlayersAreAllowed(){
        return true;
    }

    getTarget(){
        return 0;
    }

    getCalculator(){
        return new MiseryCalculator();
    }
}

export = MiseryBidAction;
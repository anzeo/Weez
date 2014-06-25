import BidAction = require("BidAction");
import Player = require("../player/Player");
import Bid = require("../bid/Bid");
import Mode = require("../game/Mode");
import MiseryCalculator = require("../calculator/MiseryCalculator");
import Game = require("../game/Game");

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
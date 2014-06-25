import BidAction = require("BidAction");
import Player = require("../player/Player");
import Bid = require("../bid/Bid");
import Mode = require("../game/Mode");
import Suit = require("../card/Suit");
import SoloCalculator = require("../calculator/SoloCalculator");
import Game = require("../game/Game");

class SoloBidAction extends BidAction {
    constructor(game:Game,player: Player,suit:Suit){
        super(game,player, new Bid(Mode.SOLO, suit));
    }

    moreActivePlayersAreAllowed(): boolean {
        return this.game.bidding.activePlayers.length < 1
    }

    getTarget(){
        return 13;
    }

    getCalculator(){
        return new SoloCalculator();
    }
}

export = SoloBidAction;
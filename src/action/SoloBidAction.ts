import BidAction = require("src/action/BidAction");
import Player = require("src/player/Player");
import Bid = require("src/bid/Bid");
import Mode = require("src/game/Mode");
import Suit = require("src/card/Suit");
import SoloCalculator = require("src/calculator/SoloCalculator");
import Game = require("src/game/Game");

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
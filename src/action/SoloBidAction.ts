import BidAction = require("src/action/BidAction");
import Player = require("src/player/Player");
import Bid = require("src/bid/Bid");
import Mode = require("src/game/Mode");
import Suit = require("src/card/Suit");

import Game = require("src/game/Game");

class SoloBidAction extends BidAction {
    constructor(player: Player,suit:Suit){
        super(player, new Bid(Mode.SOLO, suit));
    }

    moreActivePlayersAreAllowed(): boolean {
        return Game.bidding.activePlayers.length < 1
    }
}

export = SoloBidAction;
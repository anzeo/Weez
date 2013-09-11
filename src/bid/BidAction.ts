import Bid = require("src/bid/Bid");
import Player = require("src/player/Player");
import Game = require("src/game/Game");
import Phase = require("src/game/Phase");
import Mode = require("src/game/Mode");

class BidAction  {

    constructor(public player: Player, public bid:Bid){ }

    isValid():boolean{
        if(Game.phase !== Phase.BID)
            return false;

        if(Game.bidding.hasEntryFor(this.player))
            return false;

        // check if current player is active
        if(Game.currentPlayer !== this.player)
            return false;

        // a pass is always valid (TODO in case of troel this might not be the case?
        if(this.bid.mode === Mode.PASS)
            return true;

        // a maximum of 2 active players are allowed
        if(Game.bidding.activePlayers.length < 2)
            return true;

        return true;
    }

    execute():void{
        if(this.isValid()){
            Game.bidding.add(this.player, this.bid);
            if(Game.bidding.entries.length === 4){
                Game.play();
            }
            Game.advanceCurrentPlayer();
        }
    }
}

export = BidAction;
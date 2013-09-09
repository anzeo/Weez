import Bid = require("src/bid/Bid");
import Player = require("src/player/Player");
import Game = require("src/game/Game");
import Phase = require("src/game/Phase");

class BidAction  {

    constructor(public player: Player, public bid:Bid){ }

    isValid():boolean{
        if(Game.phase !== Phase.BID)
            return false;

        if(Game.bidding.hasEntryFor(this.player))
            return false;

        // TODO add extended validation here

        return true;
    }

    execute():void{
        if(this.isValid()){
            Game.bidding.add(this.player, this.bid);
            if(Game.bidding.entries.length === 4)
                Game.bidding.resolve();
        }
    }
}

export = BidAction;
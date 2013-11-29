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

        // do not allow bids that have a lower priority
        if(this.bid.mode < Game.bidding.resolvedMode){
            return false;
        }

        // a maximum of 2 active players are allowed
        if(this.moreActivePlayersAreAllowed())
            return true;

        if(this.bid.mode === Mode.SOLO && Game.bidding.resolvedTrump !== Game.defaultTrump && (this.bid.suit > Game.bidding.resolvedTrump || this.bid.suit === Game.defaultTrump) ){
            return true;
        }

        if(this.bid.mode === Mode.ABONDANCE && Game.bidding.resolvedTrump !== Game.defaultTrump && (this.bid.suit > Game.bidding.resolvedTrump || this.bid.suit === Game.defaultTrump) ){
            return true;
        }

        return false;
    }

    execute(): void {
        if(this.isValid()){
            Game.bidding.add(this.player, this.bid);
            if(Game.bidding.entries.length < 4){
                Game.advanceCurrentPlayer();
                return;
            }

            if(Game.bidding.needsConfirmation()){
                Game.currentPlayer = Game.bidding.activePlayers[0];
                Game.bidding.removeActivePlayerEntry();
            } else {
                Game.play();
            }
        }
    }

    moreActivePlayersAreAllowed(): boolean {
        switch(Game.bidding.resolvedMode){
            case Mode.NORMAL:
                return Game.bidding.activePlayers.length < 2;
                break;
            case Mode.SOLO:
                return Game.bidding.activePlayers.length < 1;
                break;
            case Mode.ABONDANCE:
                return Game.bidding.activePlayers.length < 1;
                break;
            case Mode.MISERY:
            case Mode.PASS:
            default:
                return true;
        }
    }
}

export = BidAction;
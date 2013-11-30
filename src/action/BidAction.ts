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

        // if the new mode is different
        if(Game.bidding.resolvedMode !== this.bid.mode){
            return true;
        }

        // check if more active players a re allowed
        if(this.moreActivePlayersAreAllowed()){
            return true;
        }

        if( (this.bid.mode === Mode.SOLO || this.bid.mode === Mode.ABONDANCE) && this.trumpIsHigherOrDefault()){
            return true;
        }

        return false;
    }

    execute(): void {
        if(this.isValid()){
            var isNewWinner = Game.bidding.add(this.player, this.bid);
            if(isNewWinner){
                Game.bidding.setResolvedProperties(this.player, this.bid.mode, this.getTarget(), this.bid.suit);
            }

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
        return Game.bidding.activePlayers.length < 2;
    }

    getTarget(): number {
        // if there is already an active player, this means the new target should be 8.
        return Game.bidding.activePlayers.length === 1 ? 8 : 5;
    }

    trumpIsHigherOrDefault(): boolean {
        return Game.bidding.resolvedTrump !== Game.defaultTrump && (this.bid.suit > Game.bidding.resolvedTrump || this.bid.suit === Game.defaultTrump)
    }
}

export = BidAction;
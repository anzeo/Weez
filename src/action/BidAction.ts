import Bid = require("../bid/Bid");
import Player = require("../player/Player");
import Game = require("../game/Game");
import Phase = require("../game/Phase");
import Mode = require("../game/Mode");
import DefaultCalculator = require("../calculator/DefaultCalculator")

class BidAction  {

    constructor(public game:Game,public player: Player, public bid:Bid){ }

    isValid():boolean{
        if(this.game.phase !== Phase.BID)
            return false;

        if(this.game.bidding.hasEntryFor(this.player))
            return false;

        // check if current player is active
        if(this.game.currentPlayer !== this.player)
            return false;

        // a pass is always valid (TODO in case of troel this might not be the case?
        if(this.bid.mode === Mode.PASS)
            return true;

        // do not allow bids that have a lower priority
        if(this.bid.mode < this.game.bidding.resolvedMode){
            return false;
        }

        // if the new mode is different
        if(this.game.bidding.resolvedMode !== this.bid.mode){
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

    execute(): boolean {
        if(this.isValid()){
            var isNewWinner = this.game.bidding.add(this.player, this.bid);
            if(isNewWinner){
                this.game.bidding.setResolvedProperties(this.player, this.bid.mode, this.getTarget(), this.bid.suit, this.getCalculator());
            }

            if(this.game.bidding.entries.length < 4){
                this.game.advanceCurrentPlayer();
                return true;
            }

            if(this.game.bidding.needsConfirmation()){
                this.game.currentPlayer = this.game.bidding.activePlayers[0];
                this.game.bidding.removeActivePlayerEntry();
            } else {
                this.game.play();
            }
            return true
        }
        return false;
    }

    moreActivePlayersAreAllowed(): boolean {
        return this.game.bidding.activePlayers.length < 2;
    }

    getTarget(): number {
        // if there is already an active player, this means the new target should be 8.
        return this.game.bidding.activePlayers.length === 1 ? 8 : 5;
    }

    getCalculator(): DefaultCalculator {
        return new DefaultCalculator();
    }

    trumpIsHigherOrDefault(): boolean {
        return this.game.bidding.resolvedTrump !== this.game.defaultTrump && (this.bid.suit > this.game.bidding.resolvedTrump || this.bid.suit === this.game.defaultTrump)
    }
}

export = BidAction;
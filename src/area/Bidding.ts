import Area = require("Area");
import Bid = require("../bid/Bid");
import Suit = require("../card/Suit");
import Mode = require("../game/Mode");
import Player = require("../player/Player");
import DefaultCalculator = require("../calculator/DefaultCalculator")

class Bidding extends Area<Bid> {
    activePlayers: Array<Player>;
    resolvedTrump: Suit;
    resolvedMode: Mode;
    calculator: DefaultCalculator;
    target: number;
    hasBeenConfirmed: boolean;

    constructor(){
        super();
        this.activePlayers = [];
    }

    add(player:Player, bid: Bid){
        super.add(player, bid);
        return this.checkIfEntryIsNewWinner(player, bid);
    }

    checkIfEntryIsNewWinner(player: Player, bid: Bid): boolean{
        // if resolvedMode is empty, this is the first entry we're checking
        if(!this.resolvedMode){
            this.resolvedMode = bid.mode;
            return bid.mode !== Mode.PASS ? true : false;
        }

        if(bid.mode > this.resolvedMode){
            this.reset();
            return true;
        } else if (bid.mode === this.resolvedMode){
            return true;
        }
        return false;
    }

    reset(){
        this.activePlayers = [];
        this.resolvedMode = undefined;
        this.target = undefined;
    }

    setResolvedProperties(player: Player, mode: Mode, target: number, trump: Suit, calculator: DefaultCalculator){
        this.resolvedMode = mode;
        this.activePlayers.push(player);
        this.target = target;
        this.resolvedTrump = trump;
        this.calculator = calculator;
    }

    /**
     * Removes active player entry from the bidding
     */
    removeActivePlayerEntry(){
        var activePlayer = this.activePlayers[0];
        for(var i = 0; i < this.entries.length; i++){
            if(this.entries[i].player === activePlayer){
                this.entries.splice(i,1);
            }
        }
        this.reset();
        this.hasBeenConfirmed = true;
    }

    needsConfirmation(){
        return this.resolvedMode === Mode.NORMAL && !this.hasBeenConfirmed && this.activePlayers.length === 1;
    }
}

export = Bidding;
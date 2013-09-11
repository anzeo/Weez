/// <reference path="../../def/require.d.ts" />

import Area = require("src/area/Area");
import Bid = require("src/bid/Bid");
import Suit = require("src/card/Suit");
import Mode = require("src/game/Mode");
import Player = require("src/player/Player");

class Bidding extends Area<Bid> {
    activePlayers: Array<Player>;
    resolvedTrump: Suit;
    resolvedMode: Mode;
    target: number;
    hasBeenConfirmed: boolean;

    constructor(){
        super();
        this.activePlayers = [];
    }

    add(player:Player, bid: Bid){
        super.add(player, bid);
        this.checkEntry(player, bid);
    }

    checkEntry(player: Player, bid: Bid){
        // if resolvedMode is empty, this is the first entry we're checking
        if(!this.resolvedMode){
            this.resolvedMode = bid.mode;
            if(bid.mode !== Mode.PASS){
                this.resolvedTrump = bid.suit;
                this.activePlayers.push(player);
                this.target = 5;
            }
            return;
        }

        if(bid.mode > this.resolvedMode){
            this.resolvedMode = bid.mode;
            this.resolvedTrump = bid.suit;
            this.activePlayers = [player];
            this.target = 5;
        } else if (bid.mode === this.resolvedMode){
            switch(bid.mode){
                case Mode.NORMAL:
                    this.activePlayers.push(player);
                    this.target = 8;
                    break;
                case Mode.PASS:
                default:
                    break;
            }
        }
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
        this.activePlayers = [];
        delete this.resolvedMode;
        delete this.target;
        this.hasBeenConfirmed = true;
    }

    needsConfirmation(){
        return !this.hasBeenConfirmed && this.activePlayers.length === 1;
    }
}

export = Bidding;
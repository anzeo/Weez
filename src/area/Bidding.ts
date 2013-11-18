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
                this.setResolvedProperties(player,bid);
            }
            return;
        }

        if(bid.mode > this.resolvedMode){
            this.setResolvedProperties(player, bid, true);
        } else if (bid.mode === this.resolvedMode){
            this.setResolvedProperties(player, bid);
        }
    }

    setResolvedProperties(player: Player, bid: Bid, reset?: boolean){
        if(reset){
            this.activePlayers = [];
        }
        this.resolvedMode = bid.mode;
        this.activePlayers.push(player);
        this.target = this.getTargetForModeAndPlayers(bid.mode, this.activePlayers.length);
        this.resolvedTrump = bid.mode === Mode.NORMAL ? bid.suit : undefined;
    }

    getTargetForModeAndPlayers(mode: Mode, numberOfActivePlayers: number){
        if(mode !== Mode.NORMAL){
            return 0;
        }
        return numberOfActivePlayers === 1 ? 5 : 8;
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
        return this.resolvedMode === Mode.NORMAL && !this.hasBeenConfirmed && this.activePlayers.length === 1;
    }
}

export = Bidding;
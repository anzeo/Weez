/// <reference path="../../def/require.d.ts" />

import Area = require("src/area/Area");
import Bid = require("src/bid/Bid");
import Suit = require("src/card/Suit");
import Mode = require("src/game/Mode");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");

var Game = require("src/game/Game");

class Bidding extends Area<Bid> {
    activePlayers: Array<Player>;
    resolvedTrump: Suit;
    resolvedMode: Mode;

    constructor(){
        super();
        this.activePlayers = [];
    }

    /**
     * This method will check each entry and resolve the bidding according to the bid with the highest priority.
     *
     * If the current mode has a higher priority than the previous resolved one, the current bid is taken as the resolved one.
     * Note that this implies you can never resolve this with the normal mode as PASS is not accepted
     * and hence NORMAL is the mode with lowest priority.
     *
     * If the current mode is the same as the previously resolved one, check if the active players have to be updated
     * @param entry
     */
    checkEntry(entry: Entry<Bid>){
        var bid = entry.item;
        // if resolvedMode is empty, this is the first entry we're checking
        if(!this.resolvedMode && bid.mode != Mode.PASS ){
            this.resolvedMode = bid.mode;
            this.resolvedTrump = bid.suit || Game.defaultTrump;
            return;
        }

        if(bid.mode > this.resolvedMode){
            this.resolvedMode = bid.mode;
            this.resolvedTrump = bid.suit;
            this.activePlayers = [entry.player];
        } else if (bid.mode === this.resolvedMode){
            switch(bid.mode){
                case Mode.ABONDANCE:
                    if(bid.suit > this.resolvedTrump){
                        this.resolvedTrump = bid.suit;
                        this.activePlayers = [entry.player];
                    }
                    break;
                case Mode.NORMAL:
                    if(this.activePlayers.length < 2)
                        this.activePlayers.push(entry.player);
                    break;
                case Mode.PASS:
                default:
                    break;
            }
        }
    }

    finalize(){
        Game.defaultTrump = this.resolvedTrump;
        Game.mode = this.resolvedMode;
        Game.activePlayers = this.activePlayers;
        Game.phase = Phase.PLAY;
        // TODO set target and move this to a method of Game?
    }
}


export = Bidding;
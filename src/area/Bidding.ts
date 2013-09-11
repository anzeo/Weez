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
            this.resolvedTrump = bid.suit;
            return;
        }

        if(bid.mode > this.resolvedMode){
            this.resolvedMode = bid.mode;
            this.resolvedTrump = bid.suit;
            this.activePlayers = [player];
        } else if (bid.mode === this.resolvedMode){
            switch(bid.mode){
                case Mode.NORMAL:
                    this.activePlayers.push(player);
                    break;
                case Mode.PASS:
                default:
                    break;
            }
        }
    }
}

export = Bidding;
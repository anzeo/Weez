/// <reference path="../../def/require.d.ts" />

import Area = require("src/area/Area");
import Bid = require("src/bid/Bid");
import Suit = require("src/card/Suit");
import Mode = require("src/game/GameMode");
import BidType = require("src/bid/BidType");
import Player = require("src/player/Player");
import Phase = require("src/game/Phase");

var Game = require("src/game/Game");

class Bidding extends Area<Bid> {
    activePlayers: Array<Player>;
    resolvedTrump: Suit;
    resolvedBidType: BidType;

    constructor(){
        super();
        this.activePlayers = [];
    }

    checkEntry(entry: Entry<Bid>){
        var bid = entry.item;
        if(!this.resolvedTrump){
            this.resolvedBidType = bid.bidType;
            this.resolvedTrump = bid.suit;
            return;
        }

        if(bid.bidType > this.resolvedBidType){
            this.resolvedBidType = bid.bidType;
            this.resolvedTrump = bid.suit;
            this.activePlayers.push(entry.player);
        } else if (bid.bidType === this.resolvedBidType){
            switch(bid.bidType){
                case BidType.ABONDANCE:
                    if(bid.suit > this.resolvedTrump){
                        this.resolvedBidType = bid.bidType;
                        this.resolvedTrump = bid.suit;
                        this.activePlayers = [entry.player];
                    }
                    break;
                case BidType.DEFAULT:
                    if(this.activePlayers.length < 2)
                        this.activePlayers.push(entry.player);
                    break;
                case BidType.PASS:
                default:
                    break;
            }
        }
    }

    finalize(){
        Game.defaultTrump = this.resolvedTrump;
        Game.mode = mapBidTypeToMode(this.resolvedBidType);
        Game.activePlayers = this.activePlayers;
        Game.phase = Phase.PLAY;
        // TODO set target and move this in a method of Game?
    }
}

// TODO move to util?
function mapBidTypeToMode(bidType: BidType): Mode {
    switch(bidType){
        case BidType.ABONDANCE:
            return Mode.ABONDANCE;
        case BidType.DEFAULT:
        default:
            return Mode.NORMAL;
    }
}

export = Bidding;
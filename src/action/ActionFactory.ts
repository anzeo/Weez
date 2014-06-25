import BidAction = require("BidAction");
import AbondanceBidAction = require("AbondanceBidAction");
import PassBidAction = require("PassBidAction");
import MiseryBidAction = require("MiseryBidAction");
import SoloBidAction = require("SoloBidAction");
import PlayAction = require("PlayAction");
import Player = require("../player/Player");
import Suit = require("../card/Suit");
import Card = require("../card/Card");

import Mode = require("../game/Mode");
import Bid = require("../bid/Bid");
import Game = require("../game/Game");

export var createAbondanceBidAction = function(instance:Game,player:Player,suit:Suit) : AbondanceBidAction{
        return new AbondanceBidAction(instance,player,suit);
    },

    createPassBidAction = function(instance:Game,player:Player): PassBidAction{
        return new PassBidAction(instance,player);
    },

    createMiseryBidAction = function(instance:Game,player:Player): MiseryBidAction{
        return new MiseryBidAction(instance,player);
    },

    createNormalBidAction = function(instance:Game,player:Player, suit?:Suit) : BidAction{
        return new BidAction(instance,player, new Bid(Mode.NORMAL, suit !== undefined ? suit : instance.defaultTrump));
    },

    createSoloBidAction = function(instance:Game,player:Player, suit?:Suit) : SoloBidAction{
        return new SoloBidAction(instance,player, suit !== undefined ? suit : instance.defaultTrump );
    },

    createPlayAction = function(instance:Game,player: Player, card: Card): PlayAction {
        return new PlayAction(instance,player, card);
    }
    ;
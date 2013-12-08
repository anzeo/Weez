import BidAction = require("src/action/BidAction");
import AbondanceBidAction = require("src/action/AbondanceBidAction");
import PassBidAction = require("src/action/PassBidAction");
import MiseryBidAction = require("src/action/MiseryBidAction");
import SoloBidAction = require("src/action/SoloBidAction");
import PlayAction = require("src/action/PlayAction");
import Player = require("src/player/Player");
import Suit = require("src/card/Suit");
import Card = require("src/card/Card");

import Mode = require("src/game/Mode");
import Bid = require("src/bid/Bid");
import Game = require("src/game/Game");

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
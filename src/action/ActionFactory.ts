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

export var createAbondanceBidAction = function(player:Player,suit:Suit) : AbondanceBidAction{
        return new AbondanceBidAction(player,suit);
    },

    createPassBidAction = function(player:Player): PassBidAction{
        return new PassBidAction(player);
    },

    createMiseryBidAction = function(player:Player): MiseryBidAction{
        return new MiseryBidAction(player);
    },

    createNormalBidAction = function(player:Player, suit?:Suit) : BidAction{
        return new BidAction(player, new Bid(Mode.NORMAL, suit !== undefined ? suit : Game.defaultTrump));
    },

    createSoloBidAction = function(player:Player, suit?:Suit) : SoloBidAction{
        return new SoloBidAction(player, suit !== undefined ? suit : Game.defaultTrump );
    },

    createPlayAction = function(player: Player, card: Card): PlayAction {
        return new PlayAction(player, card);
    }
    ;
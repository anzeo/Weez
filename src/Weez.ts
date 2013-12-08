/**
 * Main file for the Weez game engine
 */
import Game = require("src/game/Game");
import Player = require("src/player/Player");
import Deck = require("src/card/Deck");
import Bidding = require("src/area/Bidding");
import Table = require("src/area/Table");
import ActionFactory = require("src/action/ActionFactory");
import Suit = require("src/card/Suit");
import Card = require("src/card/Card");

var instance:Game;

export var createGame = function(players: Array<Player>): Game{
    var deck = new Deck();
    deck.shuffle();
    instance = new Game(deck,players,new Bidding(),new Table());
    return instance;
    },

    bidAbondance = function(player:Player,suit:Suit) : boolean{
        return ActionFactory.createAbondanceBidAction(instance,player,suit).execute();
    },

    pass = function(player:Player) : boolean {
        return ActionFactory.createPassBidAction(instance,player).execute();
    },

    bidMisery = function(player:Player) : boolean {
        return ActionFactory.createMiseryBidAction(instance,player).execute();
    },

    bid = function(player:Player, suit?:Suit) : boolean {
        return ActionFactory.createNormalBidAction(instance,player, suit).execute();
    },

    bidSolo = function(player:Player, suit?:Suit) : boolean {
        return ActionFactory.createSoloBidAction(instance,player, suit).execute();
    },

    play = function(player: Player, card: Card) : boolean {
        return ActionFactory.createPlayAction(instance,player, card).execute();
    };
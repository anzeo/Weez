/**
 * Main file for the Weez game engine
 */
import Game = require("game/Game");
import Player = require("player/Player");
import Deck = require("card/Deck");
import Bidding = require("area/Bidding");
import Table = require("area/Table");
import ActionFactory = require("action/ActionFactory");
import Suit = require("card/Suit");
import Card = require("card/Card");

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
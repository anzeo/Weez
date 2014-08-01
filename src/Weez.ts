/**
 * Main file for the Weez game engine
 */
import Game = require("game/Game");
import Player = require("player/Player");
import Deck = require("card/Deck");
import Bidding = require("area/Bidding");
import Table = require("area/Table");
import ActionFactory = require("action/ActionFactory");
export import Suit = require("card/Suit");
import Card = require("card/Card");

var games: { [id:string]: Game},
    players: { [id:string]: Player},
    createGUID = function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };

games = {};
players = {};

export var createGame = function(): string{
    var deck = new Deck();
    deck.shuffle();
    var id = createGUID(); 
    games[id] = new Game(deck,new Bidding(),new Table());
    return id;
},
    
    createPlayer = function(): string {
        var player = new Player(),
        id = createGUID(); 
        
        players[id] = player;
        return id;
    },
    
    join = function(gameId:string, playerId:string){
        games[gameId].addPlayer(players[playerId]);
    },
    
    bidAbondance = function(gameId:string, playerId:string, suit:Suit) : boolean{
        return ActionFactory.createAbondanceBidAction(games[gameId],players[playerId],suit).execute();
    },

    pass = function(gameId:string, playerId:string) : boolean {
        return ActionFactory.createPassBidAction(games[gameId],players[playerId]).execute();
    },

    bidMisery = function(gameId:string, playerId:string) : boolean {
        return ActionFactory.createMiseryBidAction(games[gameId],players[playerId]).execute();
    },

    bid = function(gameId:string, playerId:string, suit?:Suit) : boolean {
        return ActionFactory.createNormalBidAction(games[gameId],players[playerId], suit).execute();
    },

    bidSolo = function(gameId:string, playerId:string, suit?:Suit) : boolean {
        return ActionFactory.createSoloBidAction(games[gameId], players[playerId], suit).execute();
    },

    play = function(gameId:string, playerId:string, suit: Suit, value:number) : boolean {
        return ActionFactory.createPlayAction(games[gameId], players[playerId], new Card(value, suit)).execute();
    };
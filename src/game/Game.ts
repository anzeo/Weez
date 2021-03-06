import Card = require("../card/Card");
import Suit = require("../card/Suit");
import Deck = require("../card/Deck");
import Phase = require("Phase");
import Player = require("../player/Player");
import Mode = require("Mode");
import Bidding = require("../area/Bidding");
import Bid = require("../bid/Bid");
import Table = require("../area/Table");
import DefaultCalculator = require("../calculator/DefaultCalculator");

class Game {
    activePlayers: Array<Player>;
    currentPlayer: Player;
    deck: Deck;
    dealer: Player;
    phase: Phase;
    players: Array<Player>;
    trump: Suit;
    defaultTrump: Suit;
    bidding: Bidding;
    table: Table;
    mode:Mode;
    target: number;
    scoredTricks: number;
    calculator: DefaultCalculator;

    constructor(deck: Deck, bidding: Bidding, table:Table){
        this.deck = deck;
        this.phase = Phase.SETUP;
        this.bidding = bidding;
        this.table = table;
        this.target = 0;
        this.scoredTricks = 0;
        this.trump = undefined;
        this.players = [];
    }
    
    addPlayer(player:Player){
        if(this.players.length < 4){
            this.players.push(player);
        }
    }

    deal(){
        if(this.players.length !== 4){
            return;
        }
        
        this.dealer = this.players[0];
        var cardsToDeal: Array<Card>,
            start = (this.players.indexOf(this.dealer) + 1) % 4,
            i = 0,
            lastCard = this.deck.cards[0];

        while(this.deck.cards.length){
            cardsToDeal = this.deck.take(this.deck.cards.length > 20 ? 4 : 5);
            this.players[ (start + i++ ) % 4 ].deal(cardsToDeal);
        }

        this.currentPlayer = this.players[start];
        this.phase = Phase.BID;
        this.defaultTrump = lastCard.suit;
    }

    play(){
        this.mode = this.bidding.resolvedMode;
        if(this.mode === Mode.PASS){
            // TODO what to do in case mode is PASS?
            return;
        }
        this.phase = Phase.PLAY;

        this.trump = this.bidding.resolvedTrump;
        this.activePlayers = this.bidding.activePlayers;
        this.target = this.bidding.target;
        this.currentPlayer = this.getPlayerNextOf(this.dealer);
        this.calculator = this.bidding.calculator;
    }

    score(){
        this.phase = Phase.SCORE;
        this.calculator.score(this.players,this.activePlayers,this.target,this.scoredTricks,this.trump,this.defaultTrump);
    }

    getPlayerNextOf(player: Player): Player{
        return this.players[ (this.players.indexOf(player) + 1) % 4]
    }

    advanceCurrentPlayer(){
        this.currentPlayer = this.getPlayerNextOf(this.currentPlayer);
    }

    isActivePlayer(player: Player): boolean {
        return this.activePlayers.indexOf(player) !== -1;
    }

    isEndOfGame(): boolean {
        if(this.mode === Mode.MISERY){
            var allActivePlayersBusted = false;
            for(var i = 0; i < this.activePlayers.length; i++){
                if(!this.activePlayers[i].hasScoredTricks){
                    allActivePlayersBusted = false;
                    break;
                } else {
                    allActivePlayersBusted = true;
                }

            }

            if(allActivePlayersBusted){
                return true;
            }
        }

        if(this.mode === Mode.SOLO){
            return  (this.deck.cards.length / 4) !== this.scoredTricks;
        }

        return this.deck.cards.length === 52;
    }

    clearTable(): void {
        for(var i = 0; i < 4; i++){
            this.deck.cards.push(this.table.entries[i].item);
        }
        this.table.entries = [];
    }
}

export = Game;
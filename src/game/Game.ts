import Card = require("src/card/Card");
import Suit = require("src/card/Suit");
import Deck = require("src/card/Deck");
import Phase = require("src/game/Phase");
import Player = require("src/player/Player");
import Mode = require("src/game/Mode");
import Bidding = require("src/area/Bidding");
import Bid = require("src/bid/Bid");
import Table = require("src/area/Table");
import DefaultCalculator = require("src/calculator/DefaultCalculator");

function getPlayerNextOf(player: Player): Player{
    return players[ (players.indexOf(player) + 1) % 4]
}

export var
    activePlayers: Array<Player>,
    currentPlayer: Player,
    deck: Deck,
    dealer: Player,
    phase: Phase,
    players: Array<Player>,
    trump: Suit,
    defaultTrump: Suit,
    bidding: Bidding,
    table: Table,
    mode:Mode,
    target: number,
    scoredTicks: number,
    calculator: DefaultCalculator,

    deal = function(){
        var cardsToDeal: Array<Card>,
            start = (players.indexOf(dealer) + 1) % 4,
            i = 0,
            lastCard = deck.cards[0];

        while(deck.cards.length){
            cardsToDeal = deck.take(deck.cards.length > 20 ? 4 : 5);
            players[ (start + i++ ) % 4 ].deal(cardsToDeal);
        }

        currentPlayer = players[start];
        phase = Phase.BID;
        defaultTrump = lastCard.suit;
    },

    play = function(){
        mode = bidding.resolvedMode;
        if(mode === Mode.PASS){
            // TODO what to do in case mode is PASS?
            return;
        }

        trump = bidding.resolvedTrump;
        table.setTrump(trump);
        activePlayers = bidding.activePlayers;
        phase = Phase.PLAY;
        target = bidding.target;
        currentPlayer = getPlayerNextOf(dealer);
        calculator = bidding.calculator;
    },

    advanceCurrentPlayer = function(){
        currentPlayer = getPlayerNextOf(currentPlayer);
    },

    isActivePlayer = function(player: Player): boolean {
        return activePlayers.indexOf(player) !== -1;
    },

    setup = function(_deck: Deck, _players: Array<Player>){
        deck = _deck;
        phase = Phase.SETUP;
        players = _players;
        dealer = players[0];
        bidding = new Bidding();
        table = new Table();
        mode = undefined;
        target = 0;
        trump = undefined;
        scoredTicks = 0;
    },

    score = function(){
        phase = Phase.SCORE;
        calculator.score(players,activePlayers,target,scoredTicks,trump,defaultTrump);
    },

    isEndOfGame = function() {

        if(mode === Mode.MISERY){
            var allActivePlayersBusted = false;
            for(var i = 0; i < activePlayers.length; i++){
                if(!activePlayers[i].hasScoredTricks){
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

        if(mode === Mode.SOLO){
            return  (deck.cards.length / 4) !== scoredTicks;
        }


        return deck.cards.length === 52;
    },

    clearTable = function(): void {
        for(var i = 0; i < 4; i++){
            deck.cards.push(table.entries[i].item);
        }
        table.entries = [];
    };
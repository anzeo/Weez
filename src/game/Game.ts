import Card = require("src/card/Card");
import Suit = require("src/card/Suit");
import Deck = require("src/card/Deck");
import Phase = require("src/game/Phase");
import Player = require("src/player/Player");
import Mode = require("src/game/Mode");
import Bidding = require("src/area/Bidding");
import Bid = require("src/bid/Bid");
import Table = require("src/area/Table");

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

        trump = !(mode === Mode.PASS || mode === Mode.MISERY) ? bidding.resolvedTrump || defaultTrump : undefined; // TODO refactor this in bidding
        table.setTrump(trump);
        activePlayers = bidding.activePlayers;
        phase = Phase.PLAY;
        target = bidding.target;
        currentPlayer = getPlayerNextOf(dealer);
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

        var individualScore,
            activePlayerRate = (4 - activePlayers.length) / activePlayers.length;

        if(mode === Mode.NORMAL){
            var delta = scoredTicks - target;
            individualScore =  (delta < 0 ? -1 : 1) * (2 + Math.abs(delta));
        } else if(mode === Mode.SOLO){
            individualScore = (scoredTicks < 13 ? -1 : 1) * (defaultTrump === trump ? 30 : 15);
        } else if(mode === Mode.MISERY){
            scoreMiseryGame();
            return;
        }

        var currentPlayer : Player;
        for(var i = 0; i < 4; i++){
            currentPlayer = players[i];
            if(activePlayers.indexOf(currentPlayer) !== -1){
                currentPlayer.score += (activePlayerRate * individualScore);
            } else {
                currentPlayer.score -= individualScore;
            }
        }
    },

    scoreMiseryGame = function(){
        var activePlayersThatHaveLost: Array<Player> = filterArray(activePlayers, function(player: Player){
                return player.hasScoredTricks;
            }),
            winningActivePlayers: Array<Player> = filterArray(activePlayers, function(player: Player){
               return !player.hasScoredTricks;
            }),
            notActivePlayers: Array<Player> = filterArray(players,function(player: Player){
                return activePlayers.indexOf(player) === -1;
            });

        var playersToDecreaseScoreFrom: Array<Player> = activePlayersThatHaveLost.length > 0 ? activePlayersThatHaveLost: notActivePlayers,
            playersToIncreaseScoreFor: Array<Player> = winningActivePlayers.length > 0 ? winningActivePlayers : notActivePlayers,
            individualScore = 5,
            activePlayerRate = playersToDecreaseScoreFrom.length / playersToIncreaseScoreFor.length,
            notActivePlayerRate = 1,
            currentPlayer : Player;

        if(playersToIncreaseScoreFor.length === 0){
            return;
        }

        if(activePlayerRate < 1){
            notActivePlayerRate = 1/activePlayerRate;
            activePlayerRate = 1;
        }

        for(var i = 0; i < 4; i++){
            currentPlayer = players[i];
            if(playersToIncreaseScoreFor.indexOf(currentPlayer) !== -1){
                currentPlayer.score += (activePlayerRate * individualScore);
            } else if(playersToDecreaseScoreFrom.indexOf(currentPlayer) !== -1) {
                currentPlayer.score -= (notActivePlayerRate * individualScore);
            }
        }

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

// TODO temporary solution, will need to decide on what we're going to use later on
function filterArray(array: Array, callback: (item) => boolean): Array{
    var filteredResult = [];
    for(var i =0; i < array.length; i++){
        if(callback(array[i])){
            filteredResult.push(array[i]);
        }
    }
    return filteredResult;
}
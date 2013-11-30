import DefaultCalculator = require("src/calculator/DefaultCalculator");
import Player = require("src/player/Player");
import Suit = require("src/card/Suit");

class MiseryCalculator extends DefaultCalculator {
    score(players: Array<Player>, activePlayers: Array<Player>, target: number, scoredTicks: number, trump: Suit, defaultTrump: Suit){
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
    }
}

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

export = MiseryCalculator;
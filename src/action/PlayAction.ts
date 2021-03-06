import Player = require("../player/Player");
import Card = require("../card/Card");
import Game = require("../game/Game");
import Phase = require("../game/Phase");

class PlayAction {

    constructor(public game:Game,public player:Player, public card: Card){}

    isValid():boolean {
        if(this.game.phase !== Phase.PLAY)
            return false;
        if(this.game.table.hasEntryFor(this.player))
            return false;
        if(this.game.currentPlayer !== this.player )
            return false;
        if(!this.player.owns(this.card))
            return false;
        if(this.game.table.isEmpty())
            return true;

        var firstSuitPlayed = this.game.table.getSuitOfCard(0);
        if(this.card.suit === firstSuitPlayed)
            return true;
        if(!this.player.hasCardsOfSuit(firstSuitPlayed))
            return true;

        return false;
    }

    execute(): boolean {
        if(this.isValid()){
            this.game.table.add(this.player, this.card);
            this.player.play(this.card);

            if(this.game.table.entries.length < 4) {
                this.game.advanceCurrentPlayer();
                return true;
            }

            var winningEntry;
            for(var i = 0; i < 4; i++){
                if(!winningEntry){
                    winningEntry = this.game.table.entries[i];
                    continue;
                }
                var currentEntry = this.game.table.entries[i];
                if(currentEntry.item.suit === winningEntry.item.suit){
                    if(currentEntry.item.value === 1 || (currentEntry.item.value > winningEntry.item.value && winningEntry.item.value !== 1 )){
                        winningEntry = currentEntry;
                    }
                } else if(currentEntry.item.suit > winningEntry.item.suit || currentEntry.item.suit === this.game.trump){
                    winningEntry = currentEntry;
                }
            }

            if(this.game.isActivePlayer(winningEntry.player)){
                this.game.scoredTricks += 1; // only score if player was active
            }

            winningEntry.player.hasScoredTricks = true;
            this.game.currentPlayer = winningEntry.player;
            this.game.clearTable();

            // check for end of game
            if(this.game.isEndOfGame()) {
                this.game.score();
            }

            return true;
        }
        return false;
    }
}

export = PlayAction;
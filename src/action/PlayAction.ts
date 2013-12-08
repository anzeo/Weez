import Player = require("src/player/Player");
import Card = require("src/card/Card");
import Game = require("src/game/Game");
import Phase = require("src/game/Phase");

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
        if(this.card.suit === this.game.table.getSuitOfCard(0))
            return true;
        if(!this.player.hasCardsOfSuit(this.card.suit))
            return true;

        return false;
    }

    execute(): boolean {
        if(this.isValid()){
            this.game.table.add(this.player, this.card);
            this.game.advanceCurrentPlayer();
            this.player.play(this.card);

            if(this.game.table.entries.length === 4) {
                // TODO score logic
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
                    this.game.scoredTicks += 1; // only score if player was active
                }

                winningEntry.player.hasScoredTricks = true;

                this.game.clearTable();

                // check for end of game
                if(this.game.isEndOfGame()) {
                    this.game.score();
                }
            }
            return true;
        }
        return false;
    }
}

export = PlayAction;
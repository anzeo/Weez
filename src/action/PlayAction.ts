import Player = require("src/player/Player");
import Card = require("src/card/Card");
import Game = require("src/game/Game");
import Phase = require("src/game/Phase");

class PlayAction {

    constructor(public player:Player, public card: Card){}

    isValid():boolean {
        if(Game.phase !== Phase.PLAY)
            return false;
        if(Game.table.hasEntryFor(this.player))
            return false;
        if(Game.currentPlayer !== this.player )
            return false;
        if(!this.player.owns(this.card))
            return false;
        if(Game.table.isEmpty())
            return true;
        if(this.card.suit === Game.table.getSuitOfCard(0))
            return true;
        if(!this.player.hasCardsOfSuit(this.card.suit))
            return true;

        return false;
    }

    execute():void {
        if(this.isValid()){
            Game.table.add(this.player, this.card);
            Game.advanceCurrentPlayer();
            this.player.play(this.card);

            if(Game.table.entries.length === 4) {
                // TODO score logic
                var winningEntry;
                for(var i = 0; i < 4; i++){
                    if(!winningEntry){
                        winningEntry = Game.table.entries[i];
                        continue;
                    }
                    var currentEntry = Game.table.entries[i];
                    if(currentEntry.item.suit === winningEntry.item.suit){
                        if(currentEntry.item.value === 1 || (currentEntry.item.value > winningEntry.item.value && winningEntry.item.value !== 1 )){
                            winningEntry = currentEntry;
                        }
                    } else if(currentEntry.item.suit > winningEntry.item.suit || currentEntry.item.suit === Game.table.trump){
                        winningEntry = currentEntry;
                    }
                }

                if(Game.isActivePlayer(winningEntry.player)){
                    Game.scoredTicks += 1; // only score if player was active
                }

                Game.table.entries.length = 0;

                // check for end of game
                if(Game.deck.cards.length === 52) {
                    Game.score();
                }
            }
        }
    }
}

export = PlayAction;
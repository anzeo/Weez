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
        if(Game.table.entries.length === 0)
            return true;
        if(this.card.suit === Game.table.entries[0].item.suit)
            return true;
        if(!this.player.hasCardsOfSuit(this.card.suit))
            return true;

        return false;
    }

    execute():void {
        if(this.isValid()){
            Game.table.add(this.player, this.card);
            Game.advanceCurrentPlayer();
        }
    }
}

export = PlayAction;
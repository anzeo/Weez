///<reference path="../../def/weez.d.ts"/>
import Player = require("src/player/Player");

class Area<T> {

    entries: Array<Entry<T>>;

    constructor(){
        this.entries = [];
    }

    add(player:Player, t:T){
        this.entries.push({
            player: player,
            item: t
        });
    }

    /**
     * Checks if the items array holds an entry for the player
     * @param player
     * @returns {boolean}
     */
    hasEntryFor(player:Player){
        for(var i = 0; i < this.entries.length; i++){
            if(this.entries[i].player === player)
                return true;
        }
        return false;
    }
}

export = Area;
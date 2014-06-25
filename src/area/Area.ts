///<reference path="../../def/weez.d.ts"/>
import Player = require("../player/Player");

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

    isEmpty(): boolean {
        return this.entries.length === 0;
    }

    /**
     * Checks if the items array holds an entry for the player
     * @param player
     * @returns {boolean}
     */
    hasEntryFor(player:Player): boolean{
        return this.getItemFor(player) ? true : false;
    }

    /**
     * Returns the item for the given player
     * @param player
     * @returns {*}
     */
    getItemFor(player:Player): T {
        for(var i = 0; i < this.entries.length; i++){
            if(this.entries[i].player === player)
                return this.entries[i].item;
        }
        return undefined;
    }
}

export = Area;
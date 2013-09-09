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

    tryAdd(player:Player, t:T): boolean{

        if(this.hasEntryFor(player))
            return false;

        this.add(player,t);
        return true;
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

    /**
     * Resolves the area's items
     */
    resolve(): void {
        if(this.entries.length !== 4)
            return;

        for(var i = 0; i < 4; i++){
            this.checkEntry(this.entries[i]);
        }

        this.finalize();
    }

    checkEntry(entry: Entry<T>){

    }

    finalize(){

    }
}

export = Area;
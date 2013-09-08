///<reference path="../../def/weez.d.ts"/>
import Player = require("src/player/Player");

class Area<T> {

    items: Array<Entry<T>>

    constructor(){
        this.items = [];
    }

    add(player:Player, t:T){
        this.items.push({
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

    hasEntryFor(player:Player){
        for(var i = 0; i < this.items.length; i++){
            if(this.items[i].player === player)
                return true;
        }
        return false;
    }

    resolve(): void {

    }
}

export = Area;
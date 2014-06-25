import Card = require("../card/Card");
import Suit = require("../card/Suit");

class Player {
    hand: Array<Card>;
    score: number;
    hasScoredTricks: boolean;

    constructor(){
        this.hand = [];
        this.score = 0;
    }

    deal(cards: Array<Card>){
        this.hand = this.hand.concat(cards);
    }

    /**
     * Removes given card out of hand
     * @param card
     */
    play(card: Card){
        if(!this.owns(card)) return;
        this.hand.splice(this.hand.indexOf(card),1);
    }

    owns(card: Card){
        return this.hand.indexOf(card) !== -1;
    }

    hasCardsOfSuit(suit: Suit): boolean{
        for(var i = 0; i < this.hand.length; i++){
            if(this.hand[i].suit === suit){
                return true;
            }
        }
        return false;
    }
}

export = Player;
import Card = require("Card");
import Suit = require("Suit");

class Deck {
    cards: Array<Card>;

    constructor(){
        var cards: Array<Card>  = [];
        for(var s = 0; s < 4; s++){
            for(var i = 1; i < 14; i++){
                cards.push(new Card(i, getSuit(s)));
            }
        }
        this.cards = cards;
    }

    shuffle() {
        for (var i = this.cards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    take(amount: number){
        return this.cards.splice(-1 * amount, amount);
    }
}

// TODO find better solution to loop over an enum
function getSuit(i: number): Suit {
    switch(i){
        case 0:
            return Suit.HEARTS;
        case 1:
            return Suit.DIAMONDS;
        case 2:
            return Suit.CLUBS;
        case 3:
            return Suit.SPADES;
        default:
            throw new Error("Unknown Suit value:" + i);
    }
}



export = Deck;
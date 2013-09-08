import Card = require("src/card/Card");

class Player {
    hand: Array<Card>;
    numberOfAces: number;

    constructor(){
        this.hand = [];
        this.numberOfAces = 0;
    }

    deal(cards: Array<Card>){
        for(var i = 0; i < cards.length; i++){
            if(cards[i].value === 1){
                this.numberOfAces += 1;
            }
        }
        this.hand = this.hand.concat(cards);
    }
}

export = Player;
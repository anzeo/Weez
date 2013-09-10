import Card = require("src/card/Card");
import Suit = require("src/card/Suit");
import Deck = require("src/card/Deck");
import Phase = require("src/game/Phase");
import Player = require("src/player/Player");
import Mode = require("src/game/Mode");
import Bidding = require("src/area/Bidding");
import Bid = require("src/bid/Bid");

export var
    activePlayers: Array<Player>,
    currentPlayer: Player,
    deck: Deck,
    dealer: Player,
    phase: Phase,
    players: Array<Player>,

    defaultTrump: Suit,

    bidding: Bidding,
    mode:Mode;

export function deal(){
    var cardsToDeal: Array<Card>,
        start = (players.indexOf(dealer) + 1) % 4,
        i = 0,
        lastCard = deck.cards[0];

    while(deck.cards.length){
        cardsToDeal = deck.take(deck.cards.length > 20 ? 4 : 5);
        players[ (start + i++ ) % 4 ].deal(cardsToDeal);
    }

    currentPlayer = players[start];
    phase = Phase.BID;

    defaultTrump = lastCard.suit;
}

export function setup(_deck: Deck, _players: Array<Player>){
    deck = _deck;
    phase = Phase.SETUP;
    players = _players;
    dealer = players[0];
console.log(Bidding);
    bidding = new Bidding();
}
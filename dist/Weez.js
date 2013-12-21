
define('src/card/Suit',["require", "exports"], function(require, exports) {
    var Suit;
    (function (Suit) {
        Suit[Suit["SPADES"] = 0] = "SPADES";
        Suit[Suit["CLUBS"] = 1] = "CLUBS";
        Suit[Suit["DIAMONDS"] = 2] = "DIAMONDS";
        Suit[Suit["HEARTS"] = 3] = "HEARTS";
    })(Suit || (Suit = {}));

    
    return Suit;
});

define('src/card/Card',["require", "exports", "src/card/Suit"], function(require, exports, __Suit__) {
    var Suit = __Suit__;

    var Card = (function () {
        function Card(value, suit) {
            this.value = value;
            this.suit = suit;
        }
        Card.prototype.toString = function () {
            return this.value + " " + Suit[this.suit];
        };
        return Card;
    })();

    
    return Card;
});

define('src/card/Deck',["require", "exports", "src/card/Card", "src/card/Suit"], function(require, exports, __Card__, __Suit__) {
    var Card = __Card__;
    var Suit = __Suit__;

    var Deck = (function () {
        function Deck() {
            var cards = [];
            for (var s = 0; s < 4; s++) {
                for (var i = 1; i < 14; i++) {
                    cards.push(new Card(i, getSuit(s)));
                }
            }
            this.cards = cards;
        }
        Deck.prototype.shuffle = function () {
            for (var i = this.cards.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = this.cards[i];
                this.cards[i] = this.cards[j];
                this.cards[j] = temp;
            }
        };

        Deck.prototype.take = function (amount) {
            return this.cards.splice(-1 * amount, amount);
        };
        return Deck;
    })();

    function getSuit(i) {
        switch (i) {
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

    
    return Deck;
});

define('src/game/Phase',["require", "exports"], function(require, exports) {
    var Phase;
    (function (Phase) {
        Phase[Phase["SETUP"] = 0] = "SETUP";
        Phase[Phase["BID"] = 1] = "BID";
        Phase[Phase["PLAY"] = 2] = "PLAY";
        Phase[Phase["SCORE"] = 3] = "SCORE";
    })(Phase || (Phase = {}));
    
    return Phase;
});

define('src/player/Player',["require", "exports", "src/card/Card", "src/card/Suit"], function(require, exports, __Card__, __Suit__) {
    var Card = __Card__;
    var Suit = __Suit__;

    var Player = (function () {
        function Player() {
            this.hand = [];
            this.score = 0;
        }
        Player.prototype.deal = function (cards) {
            this.hand = this.hand.concat(cards);
        };

        Player.prototype.play = function (card) {
            if (!this.owns(card))
                return;
            this.hand.splice(this.hand.indexOf(card), 1);
        };

        Player.prototype.owns = function (card) {
            return this.hand.indexOf(card) !== -1;
        };

        Player.prototype.hasCardsOfSuit = function (suit) {
            for (var i = 0; i < this.hand.length; i++) {
                if (this.hand[i].suit === suit) {
                    return true;
                }
            }
            return false;
        };
        return Player;
    })();

    
    return Player;
});

define('src/game/Mode',["require", "exports"], function(require, exports) {
    var Mode;
    (function (Mode) {
        Mode[Mode["PASS"] = 0] = "PASS";
        Mode[Mode["NORMAL"] = 1] = "NORMAL";
        Mode[Mode["ABONDANCE"] = 2] = "ABONDANCE";
        Mode[Mode["MISERY"] = 3] = "MISERY";
        Mode[Mode["SOLO"] = 4] = "SOLO";
    })(Mode || (Mode = {}));

    
    return Mode;
});

define('src/area/Area',["require", "exports", "src/player/Player"], function(require, exports, __Player__) {
    var Player = __Player__;

    var Area = (function () {
        function Area() {
            this.entries = [];
        }
        Area.prototype.add = function (player, t) {
            this.entries.push({
                player: player,
                item: t
            });
        };

        Area.prototype.isEmpty = function () {
            return this.entries.length === 0;
        };

        Area.prototype.hasEntryFor = function (player) {
            return this.getItemFor(player) ? true : false;
        };

        Area.prototype.getItemFor = function (player) {
            for (var i = 0; i < this.entries.length; i++) {
                if (this.entries[i].player === player)
                    return this.entries[i].item;
            }
            return undefined;
        };
        return Area;
    })();

    
    return Area;
});

define('src/bid/Bid',["require", "exports", "src/card/Suit", "src/game/Mode"], function(require, exports, __Suit__, __Mode__) {
    var Suit = __Suit__;
    var Mode = __Mode__;

    var Bid = (function () {
        function Bid(mode, suit) {
            this.mode = mode;
            this.suit = suit;
            this.suit = mode !== Mode.PASS ? suit : undefined;
        }
        return Bid;
    })();


    return Bid;
});

define('src/calculator/DefaultCalculator',["require", "exports", "src/player/Player", "src/card/Suit"], function(require, exports, __Player__, __Suit__) {
    var Player = __Player__;
    var Suit = __Suit__;

    var DefaultCalculator = (function () {
        function DefaultCalculator() {
        }
        DefaultCalculator.prototype.score = function (players, activePlayers, target, scoredTicks, trump, defaultTrump) {
            var individualScore = this.getIndividualScore(scoredTicks, target, trump, defaultTrump), activePlayerRate = (4 - activePlayers.length) / activePlayers.length;

            var currentPlayer;
            for (var i = 0; i < 4; i++) {
                currentPlayer = players[i];
                if (activePlayers.indexOf(currentPlayer) !== -1) {
                    currentPlayer.score += (activePlayerRate * individualScore);
                } else {
                    currentPlayer.score -= individualScore;
                }
            }
        };

        DefaultCalculator.prototype.getIndividualScore = function (scoredTicks, target, trump, defaultTrump) {
            var delta = scoredTicks - target;
            return (delta < 0 ? -1 : 1) * (2 + Math.abs(delta));
        };
        return DefaultCalculator;
    })();

    
    return DefaultCalculator;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('src/area/Bidding',["require", "exports", "src/area/Area", "src/bid/Bid", "src/card/Suit", "src/game/Mode", "src/player/Player", "src/calculator/DefaultCalculator"], function(require, exports, __Area__, __Bid__, __Suit__, __Mode__, __Player__, __DefaultCalculator__) {
    var Area = __Area__;
    var Bid = __Bid__;
    var Suit = __Suit__;
    var Mode = __Mode__;
    var Player = __Player__;
    var DefaultCalculator = __DefaultCalculator__;

    var Bidding = (function (_super) {
        __extends(Bidding, _super);
        function Bidding() {
            _super.call(this);
            this.activePlayers = [];
        }
        Bidding.prototype.add = function (player, bid) {
            _super.prototype.add.call(this, player, bid);
            return this.checkIfEntryIsNewWinner(player, bid);
        };

        Bidding.prototype.checkIfEntryIsNewWinner = function (player, bid) {
            if (!this.resolvedMode) {
                this.resolvedMode = bid.mode;
                return bid.mode !== Mode.PASS ? true : false;
            }

            if (bid.mode > this.resolvedMode) {
                this.reset();
                return true;
            } else if (bid.mode === this.resolvedMode) {
                return true;
            }
            return false;
        };

        Bidding.prototype.reset = function () {
            this.activePlayers = [];
            this.resolvedMode = undefined;
            this.target = undefined;
        };

        Bidding.prototype.setResolvedProperties = function (player, mode, target, trump, calculator) {
            this.resolvedMode = mode;
            this.activePlayers.push(player);
            this.target = target;
            this.resolvedTrump = trump;
            this.calculator = calculator;
        };

        Bidding.prototype.removeActivePlayerEntry = function () {
            var activePlayer = this.activePlayers[0];
            for (var i = 0; i < this.entries.length; i++) {
                if (this.entries[i].player === activePlayer) {
                    this.entries.splice(i, 1);
                }
            }
            this.reset();
            this.hasBeenConfirmed = true;
        };

        Bidding.prototype.needsConfirmation = function () {
            return this.resolvedMode === Mode.NORMAL && !this.hasBeenConfirmed && this.activePlayers.length === 1;
        };
        return Bidding;
    })(Area);

    
    return Bidding;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('src/area/Table',["require", "exports", "src/area/Area", "src/card/Card", "src/card/Suit"], function(require, exports, __Area__, __Card__, __Suit__) {
    var Area = __Area__;
    var Card = __Card__;
    var Suit = __Suit__;

    var Table = (function (_super) {
        __extends(Table, _super);
        function Table() {
            _super.apply(this, arguments);
        }
        Table.prototype.getSuitOfCard = function (i) {
            return this.entries[i].item.suit;
        };
        return Table;
    })(Area);

    
    return Table;
});

define('src/game/Game',["require", "exports", "src/card/Card", "src/card/Suit", "src/card/Deck", "src/game/Phase", "src/player/Player", "src/game/Mode", "src/area/Bidding", "src/bid/Bid", "src/area/Table", "src/calculator/DefaultCalculator"], function(require, exports, __Card__, __Suit__, __Deck__, __Phase__, __Player__, __Mode__, __Bidding__, __Bid__, __Table__, __DefaultCalculator__) {
    var Card = __Card__;
    var Suit = __Suit__;
    var Deck = __Deck__;
    var Phase = __Phase__;
    var Player = __Player__;
    var Mode = __Mode__;
    var Bidding = __Bidding__;
    var Bid = __Bid__;
    var Table = __Table__;
    var DefaultCalculator = __DefaultCalculator__;

    var Game = (function () {
        function Game(deck, players, bidding, table) {
            this.deck = deck;
            this.phase = Phase.SETUP;
            this.players = players;
            this.dealer = players[0];
            this.bidding = bidding;
            this.table = table;
            this.target = 0;
            this.scoredTicks = 0;
            this.trump = undefined;
        }
        Game.prototype.deal = function () {
            var cardsToDeal, start = (this.players.indexOf(this.dealer) + 1) % 4, i = 0, lastCard = this.deck.cards[0];

            while (this.deck.cards.length) {
                cardsToDeal = this.deck.take(this.deck.cards.length > 20 ? 4 : 5);
                this.players[(start + i++) % 4].deal(cardsToDeal);
            }

            this.currentPlayer = this.players[start];
            this.phase = Phase.BID;
            this.defaultTrump = lastCard.suit;
        };

        Game.prototype.play = function () {
            this.mode = this.bidding.resolvedMode;
            if (this.mode === Mode.PASS) {
                return;
            }
            this.phase = Phase.PLAY;

            this.trump = this.bidding.resolvedTrump;
            this.activePlayers = this.bidding.activePlayers;
            this.target = this.bidding.target;
            this.currentPlayer = this.getPlayerNextOf(this.dealer);
            this.calculator = this.bidding.calculator;
        };

        Game.prototype.score = function () {
            this.phase = Phase.SCORE;
            this.calculator.score(this.players, this.activePlayers, this.target, this.scoredTicks, this.trump, this.defaultTrump);
        };

        Game.prototype.getPlayerNextOf = function (player) {
            return this.players[(this.players.indexOf(player) + 1) % 4];
        };

        Game.prototype.advanceCurrentPlayer = function () {
            this.currentPlayer = this.getPlayerNextOf(this.currentPlayer);
        };

        Game.prototype.isActivePlayer = function (player) {
            return this.activePlayers.indexOf(player) !== -1;
        };

        Game.prototype.isEndOfGame = function () {
            if (this.mode === Mode.MISERY) {
                var allActivePlayersBusted = false;
                for (var i = 0; i < this.activePlayers.length; i++) {
                    if (!this.activePlayers[i].hasScoredTricks) {
                        allActivePlayersBusted = false;
                        break;
                    } else {
                        allActivePlayersBusted = true;
                    }
                }

                if (allActivePlayersBusted) {
                    return true;
                }
            }

            if (this.mode === Mode.SOLO) {
                return (this.deck.cards.length / 4) !== this.scoredTicks;
            }

            return this.deck.cards.length === 52;
        };

        Game.prototype.clearTable = function () {
            for (var i = 0; i < 4; i++) {
                this.deck.cards.push(this.table.entries[i].item);
            }
            this.table.entries = [];
        };
        return Game;
    })();

    
    return Game;
});

define('src/action/BidAction',["require", "exports", "src/bid/Bid", "src/player/Player", "src/game/Game", "src/game/Phase", "src/game/Mode", "src/calculator/DefaultCalculator"], function(require, exports, __Bid__, __Player__, __Game__, __Phase__, __Mode__, __DefaultCalculator__) {
    var Bid = __Bid__;
    var Player = __Player__;
    var Game = __Game__;
    var Phase = __Phase__;
    var Mode = __Mode__;
    var DefaultCalculator = __DefaultCalculator__;

    var BidAction = (function () {
        function BidAction(game, player, bid) {
            this.game = game;
            this.player = player;
            this.bid = bid;
        }
        BidAction.prototype.isValid = function () {
            if (this.game.phase !== Phase.BID)
                return false;

            if (this.game.bidding.hasEntryFor(this.player))
                return false;

            if (this.game.currentPlayer !== this.player)
                return false;

            if (this.bid.mode === Mode.PASS)
                return true;

            if (this.bid.mode < this.game.bidding.resolvedMode) {
                return false;
            }

            if (this.game.bidding.resolvedMode !== this.bid.mode) {
                return true;
            }

            if (this.moreActivePlayersAreAllowed()) {
                return true;
            }

            if ((this.bid.mode === Mode.SOLO || this.bid.mode === Mode.ABONDANCE) && this.trumpIsHigherOrDefault()) {
                return true;
            }

            return false;
        };

        BidAction.prototype.execute = function () {
            if (this.isValid()) {
                var isNewWinner = this.game.bidding.add(this.player, this.bid);
                if (isNewWinner) {
                    this.game.bidding.setResolvedProperties(this.player, this.bid.mode, this.getTarget(), this.bid.suit, this.getCalculator());
                }

                if (this.game.bidding.entries.length < 4) {
                    this.game.advanceCurrentPlayer();
                    return true;
                }

                if (this.game.bidding.needsConfirmation()) {
                    this.game.currentPlayer = this.game.bidding.activePlayers[0];
                    this.game.bidding.removeActivePlayerEntry();
                } else {
                    this.game.play();
                }
                return true;
            }
            return false;
        };

        BidAction.prototype.moreActivePlayersAreAllowed = function () {
            return this.game.bidding.activePlayers.length < 2;
        };

        BidAction.prototype.getTarget = function () {
            return this.game.bidding.activePlayers.length === 1 ? 8 : 5;
        };

        BidAction.prototype.getCalculator = function () {
            return new DefaultCalculator();
        };

        BidAction.prototype.trumpIsHigherOrDefault = function () {
            return this.game.bidding.resolvedTrump !== this.game.defaultTrump && (this.bid.suit > this.game.bidding.resolvedTrump || this.bid.suit === this.game.defaultTrump);
        };
        return BidAction;
    })();

    
    return BidAction;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('src/action/AbondanceBidAction',["require", "exports", "src/action/BidAction", "src/player/Player", "src/card/Suit", "src/game/Mode", "src/bid/Bid", "src/game/Game"], function(require, exports, __BidAction__, __Player__, __Suit__, __Mode__, __Bid__, __Game__) {
    var BidAction = __BidAction__;
    var Player = __Player__;
    var Suit = __Suit__;
    var Mode = __Mode__;
    var Bid = __Bid__;

    var Game = __Game__;

    var AbondanceBidAction = (function (_super) {
        __extends(AbondanceBidAction, _super);
        function AbondanceBidAction(game, player, suit) {
            _super.call(this, game, player, new Bid(Mode.ABONDANCE, suit));
        }
        AbondanceBidAction.prototype.moreActivePlayersAreAllowed = function () {
            return this.game.bidding.activePlayers.length < 1;
        };

        AbondanceBidAction.prototype.getTarget = function () {
            return 9;
        };
        return AbondanceBidAction;
    })(BidAction);

    
    return AbondanceBidAction;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('src/action/PassBidAction',["require", "exports", "src/action/BidAction", "src/player/Player", "src/bid/Bid", "src/game/Mode", "src/game/Game"], function(require, exports, __BidAction__, __Player__, __Bid__, __Mode__, __Game__) {
    var BidAction = __BidAction__;
    var Player = __Player__;
    var Bid = __Bid__;
    var Mode = __Mode__;
    var Game = __Game__;

    var PassBidAction = (function (_super) {
        __extends(PassBidAction, _super);
        function PassBidAction(game, player) {
            _super.call(this, game, player, new Bid(Mode.PASS));
        }
        PassBidAction.prototype.moreActivePlayersAreAllowed = function () {
            return true;
        };

        PassBidAction.prototype.getTarget = function () {
            return 0;
        };
        return PassBidAction;
    })(BidAction);

    
    return PassBidAction;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('src/calculator/MiseryCalculator',["require", "exports", "src/calculator/DefaultCalculator", "src/player/Player", "src/card/Suit"], function(require, exports, __DefaultCalculator__, __Player__, __Suit__) {
    var DefaultCalculator = __DefaultCalculator__;
    var Player = __Player__;
    var Suit = __Suit__;

    var MiseryCalculator = (function (_super) {
        __extends(MiseryCalculator, _super);
        function MiseryCalculator() {
            _super.apply(this, arguments);
        }
        MiseryCalculator.prototype.score = function (players, activePlayers, target, scoredTicks, trump, defaultTrump) {
            var activePlayersThatHaveLost = filterArray(activePlayers, function (player) {
                return player.hasScoredTricks;
            }), winningActivePlayers = filterArray(activePlayers, function (player) {
                return !player.hasScoredTricks;
            }), notActivePlayers = filterArray(players, function (player) {
                return activePlayers.indexOf(player) === -1;
            });

            var playersToDecreaseScoreFrom = activePlayersThatHaveLost.length > 0 ? activePlayersThatHaveLost : notActivePlayers, playersToIncreaseScoreFor = winningActivePlayers.length > 0 ? winningActivePlayers : notActivePlayers, individualScore = 5, activePlayerRate = playersToDecreaseScoreFrom.length / playersToIncreaseScoreFor.length, notActivePlayerRate = 1, currentPlayer;

            if (playersToIncreaseScoreFor.length === 0) {
                return;
            }

            if (activePlayerRate < 1) {
                notActivePlayerRate = 1 / activePlayerRate;
                activePlayerRate = 1;
            }

            for (var i = 0; i < 4; i++) {
                currentPlayer = players[i];
                if (playersToIncreaseScoreFor.indexOf(currentPlayer) !== -1) {
                    currentPlayer.score += (activePlayerRate * individualScore);
                } else if (playersToDecreaseScoreFrom.indexOf(currentPlayer) !== -1) {
                    currentPlayer.score -= (notActivePlayerRate * individualScore);
                }
            }
        };
        return MiseryCalculator;
    })(DefaultCalculator);

    function filterArray(array, callback) {
        var filteredResult = [];
        for (var i = 0; i < array.length; i++) {
            if (callback(array[i])) {
                filteredResult.push(array[i]);
            }
        }
        return filteredResult;
    }

    
    return MiseryCalculator;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('src/action/MiseryBidAction',["require", "exports", "src/action/BidAction", "src/player/Player", "src/bid/Bid", "src/game/Mode", "src/calculator/MiseryCalculator", "src/game/Game"], function(require, exports, __BidAction__, __Player__, __Bid__, __Mode__, __MiseryCalculator__, __Game__) {
    var BidAction = __BidAction__;
    var Player = __Player__;
    var Bid = __Bid__;
    var Mode = __Mode__;
    var MiseryCalculator = __MiseryCalculator__;
    var Game = __Game__;

    var MiseryBidAction = (function (_super) {
        __extends(MiseryBidAction, _super);
        function MiseryBidAction(game, player) {
            _super.call(this, game, player, new Bid(Mode.MISERY));
        }
        MiseryBidAction.prototype.moreActivePlayersAreAllowed = function () {
            return true;
        };

        MiseryBidAction.prototype.getTarget = function () {
            return 0;
        };

        MiseryBidAction.prototype.getCalculator = function () {
            return new MiseryCalculator();
        };
        return MiseryBidAction;
    })(BidAction);

    
    return MiseryBidAction;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('src/calculator/SoloCalculator',["require", "exports", "src/card/Suit", "src/calculator/DefaultCalculator"], function(require, exports, __Suit__, __DefaultCalculator__) {
    var Suit = __Suit__;
    var DefaultCalculator = __DefaultCalculator__;

    var SoloCalculator = (function (_super) {
        __extends(SoloCalculator, _super);
        function SoloCalculator() {
            _super.apply(this, arguments);
        }
        SoloCalculator.prototype.getIndividualScore = function (scoredTicks, target, trump, defaultTrump) {
            return (scoredTicks < 13 ? -1 : 1) * (defaultTrump === trump ? 30 : 15);
        };
        return SoloCalculator;
    })(DefaultCalculator);

    
    return SoloCalculator;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('src/action/SoloBidAction',["require", "exports", "src/action/BidAction", "src/player/Player", "src/bid/Bid", "src/game/Mode", "src/card/Suit", "src/calculator/SoloCalculator", "src/game/Game"], function(require, exports, __BidAction__, __Player__, __Bid__, __Mode__, __Suit__, __SoloCalculator__, __Game__) {
    var BidAction = __BidAction__;
    var Player = __Player__;
    var Bid = __Bid__;
    var Mode = __Mode__;
    var Suit = __Suit__;
    var SoloCalculator = __SoloCalculator__;
    var Game = __Game__;

    var SoloBidAction = (function (_super) {
        __extends(SoloBidAction, _super);
        function SoloBidAction(game, player, suit) {
            _super.call(this, game, player, new Bid(Mode.SOLO, suit));
        }
        SoloBidAction.prototype.moreActivePlayersAreAllowed = function () {
            return this.game.bidding.activePlayers.length < 1;
        };

        SoloBidAction.prototype.getTarget = function () {
            return 13;
        };

        SoloBidAction.prototype.getCalculator = function () {
            return new SoloCalculator();
        };
        return SoloBidAction;
    })(BidAction);

    
    return SoloBidAction;
});

define('src/action/PlayAction',["require", "exports", "src/player/Player", "src/card/Card", "src/game/Game", "src/game/Phase"], function(require, exports, __Player__, __Card__, __Game__, __Phase__) {
    var Player = __Player__;
    var Card = __Card__;
    var Game = __Game__;
    var Phase = __Phase__;

    var PlayAction = (function () {
        function PlayAction(game, player, card) {
            this.game = game;
            this.player = player;
            this.card = card;
        }
        PlayAction.prototype.isValid = function () {
            if (this.game.phase !== Phase.PLAY)
                return false;
            if (this.game.table.hasEntryFor(this.player))
                return false;
            if (this.game.currentPlayer !== this.player)
                return false;
            if (!this.player.owns(this.card))
                return false;
            if (this.game.table.isEmpty())
                return true;

            var firstSuitPlayed = this.game.table.getSuitOfCard(0);
            if (this.card.suit === firstSuitPlayed)
                return true;
            if (!this.player.hasCardsOfSuit(firstSuitPlayed))
                return true;

            return false;
        };

        PlayAction.prototype.execute = function () {
            if (this.isValid()) {
                this.game.table.add(this.player, this.card);
                this.player.play(this.card);

                if (this.game.table.entries.length < 4) {
                    this.game.advanceCurrentPlayer();
                    return true;
                }

                var winningEntry;
                for (var i = 0; i < 4; i++) {
                    if (!winningEntry) {
                        winningEntry = this.game.table.entries[i];
                        continue;
                    }
                    var currentEntry = this.game.table.entries[i];
                    if (currentEntry.item.suit === winningEntry.item.suit) {
                        if (currentEntry.item.value === 1 || (currentEntry.item.value > winningEntry.item.value && winningEntry.item.value !== 1)) {
                            winningEntry = currentEntry;
                        }
                    } else if (currentEntry.item.suit > winningEntry.item.suit || currentEntry.item.suit === this.game.trump) {
                        winningEntry = currentEntry;
                    }
                }

                if (this.game.isActivePlayer(winningEntry.player)) {
                    this.game.scoredTicks += 1;
                }

                winningEntry.player.hasScoredTricks = true;
                this.game.currentPlayer = winningEntry.player;
                this.game.clearTable();

                if (this.game.isEndOfGame()) {
                    this.game.score();
                }

                return true;
            }
            return false;
        };
        return PlayAction;
    })();

    
    return PlayAction;
});

define('src/action/ActionFactory',["require", "exports", "src/action/BidAction", "src/action/AbondanceBidAction", "src/action/PassBidAction", "src/action/MiseryBidAction", "src/action/SoloBidAction", "src/action/PlayAction", "src/player/Player", "src/card/Suit", "src/card/Card", "src/game/Mode", "src/bid/Bid", "src/game/Game"], function(require, exports, __BidAction__, __AbondanceBidAction__, __PassBidAction__, __MiseryBidAction__, __SoloBidAction__, __PlayAction__, __Player__, __Suit__, __Card__, __Mode__, __Bid__, __Game__) {
    var BidAction = __BidAction__;
    var AbondanceBidAction = __AbondanceBidAction__;
    var PassBidAction = __PassBidAction__;
    var MiseryBidAction = __MiseryBidAction__;
    var SoloBidAction = __SoloBidAction__;
    var PlayAction = __PlayAction__;
    var Player = __Player__;
    var Suit = __Suit__;
    var Card = __Card__;

    var Mode = __Mode__;
    var Bid = __Bid__;
    var Game = __Game__;

    exports.createAbondanceBidAction = function (instance, player, suit) {
        return new AbondanceBidAction(instance, player, suit);
    }, exports.createPassBidAction = function (instance, player) {
        return new PassBidAction(instance, player);
    }, exports.createMiseryBidAction = function (instance, player) {
        return new MiseryBidAction(instance, player);
    }, exports.createNormalBidAction = function (instance, player, suit) {
        return new BidAction(instance, player, new Bid(Mode.NORMAL, suit !== undefined ? suit : instance.defaultTrump));
    }, exports.createSoloBidAction = function (instance, player, suit) {
        return new SoloBidAction(instance, player, suit !== undefined ? suit : instance.defaultTrump);
    }, exports.createPlayAction = function (instance, player, card) {
        return new PlayAction(instance, player, card);
    };
});

define('src/Weez',["require", "exports", "src/game/Game", "src/player/Player", "src/card/Deck", "src/area/Bidding", "src/area/Table", "src/action/ActionFactory", "src/card/Suit", "src/card/Card"], function(require, exports, __Game__, __Player__, __Deck__, __Bidding__, __Table__, __ActionFactory__, __Suit__, __Card__) {
    var Game = __Game__;
    var Player = __Player__;
    var Deck = __Deck__;
    var Bidding = __Bidding__;
    var Table = __Table__;
    var ActionFactory = __ActionFactory__;
    var Suit = __Suit__;
    var Card = __Card__;

    var instance;

    exports.createGame = function (players) {
        var deck = new Deck();
        deck.shuffle();
        instance = new Game(deck, players, new Bidding(), new Table());
        return instance;
    }, exports.bidAbondance = function (player, suit) {
        return ActionFactory.createAbondanceBidAction(instance, player, suit).execute();
    }, exports.pass = function (player) {
        return ActionFactory.createPassBidAction(instance, player).execute();
    }, exports.bidMisery = function (player) {
        return ActionFactory.createMiseryBidAction(instance, player).execute();
    }, exports.bid = function (player, suit) {
        return ActionFactory.createNormalBidAction(instance, player, suit).execute();
    }, exports.bidSolo = function (player, suit) {
        return ActionFactory.createSoloBidAction(instance, player, suit).execute();
    }, exports.play = function (player, card) {
        return ActionFactory.createPlayAction(instance, player, card).execute();
    };
});

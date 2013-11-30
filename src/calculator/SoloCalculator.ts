import Suit = require("src/card/Suit");
import DefaultCalculator = require("src/calculator/DefaultCalculator");

class SoloCalculator extends DefaultCalculator {
    getIndividualScore(scoredTicks: number, target: number, trump: Suit, defaultTrump: Suit): number {
        return (scoredTicks < 13 ? -1 : 1) * (defaultTrump === trump ? 30 : 15);
    }
}

export = SoloCalculator;
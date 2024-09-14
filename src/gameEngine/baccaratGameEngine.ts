import { Hand } from '../hand';
import { BaccaratResultsEngine } from '../baccaratResultsEngine';
import { Shoe } from '../shoe';

/**
 * Plays a baccarat game according to Punto Banco rules
 */
export class BaccaratGameEngine {
    private resultsEngine: BaccaratResultsEngine;
    private shoe: Shoe;

    /**
     * BaccaratGameEngine
     * @constructor
     */
    constructor() {
        this.resultsEngine = new BaccaratResultsEngine();
        this.shoe = new Shoe(8);
    }

    /**
     * Can another game be played without creating another deck.
     */
    get isBurnNeeded(): boolean {
        return this.shoe.cutCardReached;
    }

    /**
     * Performs a burn operation
     * @return {Card} Burn indicator card
     * @return {Card[]} Burn cards
     */
    burnCards(): { burnCard: Card, burnCards: Card[] } {
        const burnCard = this.shoe.draw();
        const burnCards: Card[] = [];

        let burnCardValue = BaccaratResultsEngine.valueForCard(burnCard);

        // Face cards & T count for 10 during burn
        if (burnCardValue === 0) burnCardValue = 10;

        for (let i = 0; i < burnCardValue; i++) {
            burnCards.push(this.shoe.draw());
        }

        return { burnCard, burnCards };
    }

    /**
     * Performs a game
     * @return {Hand} Game play hand data
     */
    dealGame(): Hand {
        const pCard1 = this.shoe.draw();
        const bCard1 = this.shoe.draw();
        const pCard2 = this.shoe.draw();
        const bCard2 = this.shoe.draw();

        const hand = new Hand();

        hand.playerCards.push(pCard1, pCard2);
        hand.bankerCards.push(bCard1, bCard2);

        let bankerCardsValue = this.resultsEngine.calculateHandValue(hand.bankerCards);
        let playerCardsValue = this.resultsEngine.calculateHandValue(hand.playerCards);

        let bankerDraw = false;

        // Natural (Dealer or Player drew an 8 or 9) - neither side draws, game over.
        if (bankerCardsValue > 7 || playerCardsValue > 7) {
            return hand;
            // Player has 6 or 7 - stands
        } else if (playerCardsValue > 5) {
            // Player stood so dealer draws with [0-5] and stands with 6 or 7
            if (bankerCardsValue <= 5) {
                bankerDraw = true;
            }
            // Player has 0 - 5, draws 3rd card
        } else {
            const player3rdCard = this.shoe.draw();
            hand.playerCards.push(player3rdCard);
            const player3rdCardValue = BaccaratResultsEngine.valueForCard(player3rdCard);

            switch (player3rdCardValue) {
                case 2:
                case 3:
                    if (bankerCardsValue < 5) bankerDraw = true;
                    break;
                case 4:
                case 5:
                    if (bankerCardsValue < 6) bankerDraw = true;
                    break;
                case 6:
                case 7:
                    if (bankerCardsValue < 7) bankerDraw = true;
                    break;
                case 8:
                    if (bankerCardsValue < 3) bankerDraw = true;
                    break;
                case 9:
                case 0:
                case 1:
                    if (bankerCardsValue < 4) bankerDraw = true;
                    break;
            }
        }

        if (bankerDraw) {
            const banker3rdCard = this.shoe.draw();
            hand.bankerCards.push(banker3rdCard);
            bankerCardsValue = this.resultsEngine.calculateHandValue(hand.bankerCards);
        }

        return hand;
    }
}

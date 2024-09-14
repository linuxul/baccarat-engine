"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaccaratGameEngine = void 0;
const hand_1 = require("../hand");
const baccaratResultsEngine_1 = require("../baccaratResultsEngine");
const shoe_1 = require("../shoe");
/**
 * Plays a baccarat game according to Punto Banco rules
 */
class BaccaratGameEngine {
    /**
     * BaccaratGameEngine
     * @constructor
     */
    constructor() {
        this.resultsEngine = new baccaratResultsEngine_1.BaccaratResultsEngine();
        this.shoe = new shoe_1.Shoe(8);
    }
    /**
     * Can another game be played without creating another deck.
     */
    get isBurnNeeded() {
        return this.shoe.cutCardReached;
    }
    /**
     * Performs a burn operation
     * @return {Card} Burn indicator card
     * @return {Card[]} Burn cards
     */
    burnCards() {
        const burnCard = this.shoe.draw();
        const burnCards = [];
        let burnCardValue = baccaratResultsEngine_1.BaccaratResultsEngine.valueForCard(burnCard);
        // Face cards & T count for 10 during burn
        if (burnCardValue === 0)
            burnCardValue = 10;
        for (let i = 0; i < burnCardValue; i++) {
            burnCards.push(this.shoe.draw());
        }
        return { burnCard, burnCards };
    }
    /**
     * Performs a game
     * @return {Hand} Game play hand data
     */
    dealGame() {
        const pCard1 = this.shoe.draw();
        const bCard1 = this.shoe.draw();
        const pCard2 = this.shoe.draw();
        const bCard2 = this.shoe.draw();
        const hand = new hand_1.Hand();
        hand.playerCards.push(pCard1, pCard2);
        hand.bankerCards.push(bCard1, bCard2);
        let bankerCardsValue = this.resultsEngine.calculateHandValue(hand.bankerCards);
        let playerCardsValue = this.resultsEngine.calculateHandValue(hand.playerCards);
        let bankerDraw = false;
        // Natural (Dealer or Player drew an 8 or 9) - neither side draws, game over.
        if (bankerCardsValue > 7 || playerCardsValue > 7) {
            return hand;
            // Player has 6 or 7 - stands
        }
        else if (playerCardsValue > 5) {
            // Player stood so dealer draws with [0-5] and stands with 6 or 7
            if (bankerCardsValue <= 5) {
                bankerDraw = true;
            }
            // Player has 0 - 5, draws 3rd card
        }
        else {
            const player3rdCard = this.shoe.draw();
            hand.playerCards.push(player3rdCard);
            const player3rdCardValue = baccaratResultsEngine_1.BaccaratResultsEngine.valueForCard(player3rdCard);
            switch (player3rdCardValue) {
                case 2:
                case 3:
                    if (bankerCardsValue < 5)
                        bankerDraw = true;
                    break;
                case 4:
                case 5:
                    if (bankerCardsValue < 6)
                        bankerDraw = true;
                    break;
                case 6:
                case 7:
                    if (bankerCardsValue < 7)
                        bankerDraw = true;
                    break;
                case 8:
                    if (bankerCardsValue < 3)
                        bankerDraw = true;
                    break;
                case 9:
                case 0:
                case 1:
                    if (bankerCardsValue < 4)
                        bankerDraw = true;
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
exports.BaccaratGameEngine = BaccaratGameEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFjY2FyYXRHYW1lRW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVFbmdpbmUvYmFjY2FyYXRHYW1lRW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtDQUErQjtBQUMvQixvRUFBaUU7QUFDakUsa0NBQStCO0FBRy9COztHQUVHO0FBQ0gsTUFBYSxrQkFBa0I7SUFJM0I7OztPQUdHO0lBQ0g7UUFDSSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkNBQXFCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksV0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksWUFBWTtRQUNaLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxTQUFTO1FBQ0wsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNsQyxNQUFNLFNBQVMsR0FBVyxFQUFFLENBQUM7UUFFN0IsSUFBSSxhQUFhLEdBQUcsNkNBQXFCLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWpFLDBDQUEwQztRQUMxQyxJQUFJLGFBQWEsS0FBSyxDQUFDO1lBQUUsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUU1QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsUUFBUTtRQUNKLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJ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
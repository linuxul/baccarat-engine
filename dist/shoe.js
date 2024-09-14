"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shoe = void 0;
const events_1 = require("events");
const shuffle_array_1 = require("shuffle-array");
const card_1 = require("./card");
const CutCardLengthFromBottom = 16;
/**
 * Baccarat shoe
 */
class Shoe extends events_1.EventEmitter {
    /**
     * Cards left
     * @return {number} Count of cards left
     */
    get cardsLeft() {
        return this.cards.length;
    }
    /**
     * Number of cards before the cut card
     * @return {number} Count of cards left before cut card
     */
    get cardsBeforeCutCard() {
        return Math.max(0, this.cardsLeft - CutCardLengthFromBottom);
    }
    /**
     * Has the cut card been reached
     * @return {boolean} true if the cut card has been reached, false otherwise
     */
    get cutCardReached() {
        return this.cardsBeforeCutCard <= 0;
    }
    /**
     * Shoe constructor
     * @param {number} decks - Count of decks to be included in the shoe
     */
    constructor(decks) {
        super();
        this.decks = decks;
        this.cards = [];
    }
    /**
     * Creates the cards array
     */
    createDecks() {
        for (let i = 0; i < this.decks; i++) {
            for (let j = 0; j < 52; j++) {
                this.cards.push(this.createCard(j));
            }
        }
    }
    /**
     * Shuffles the cards array
     */
    shuffle() {
        (0, shuffle_array_1.default)(this.cards);
    }
    /**
     * Draws the next card
     * @return {Card} Card drawn
     */
    draw() {
        if (this.cards.length === 0) {
            this.createDecks();
            this.shuffle();
        }
        return this.cards.pop();
    }
    /**
     * To string
     * @return {string} String representation of the shoe
     */
    toString() {
        return `[${this.cards.map((c) => c.toString()).join(', ')}]`;
    }
    /**
     * Creates a card from the value passed in
     * @param {number} value - The integer value to be converted
     * @return {Card} Card created
     */
    createCard(value) {
        const suit = Math.floor(value / 13);
        const cardValue = value % 13;
        const suitString = card_1.Card.DefaultSuits[suit];
        const valueString = card_1.Card.DefaultValues[cardValue];
        return new card_1.Card(suitString, valueString);
    }
}
exports.Shoe = Shoe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zaG9lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFzQztBQUN0QyxpREFBeUM7QUFDekMsaUNBQThCO0FBRTlCLE1BQU0sdUJBQXVCLEdBQUcsRUFBRSxDQUFDO0FBRW5DOztHQUVHO0FBQ0gsTUFBYSxJQUFLLFNBQVEscUJBQVk7SUFJbEM7OztPQUdHO0lBQ0gsSUFBSSxTQUFTO1FBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxrQkFBa0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLHVCQUF1QixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksY0FBYztRQUNkLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWSxLQUFhO1FBQ3JCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsV0FBVztRQUNQLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2QztTQUNKO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsT0FBTztRQUNILElBQUEsdUJBQVksRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUk7UUFDQSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxRQUFRO1FBQ0osT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFVBQVUsQ0FBQyxLQUFhO1FBQ3BCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sU0FBUyxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFN0IsTUFBTSxVQUFVLEdBQUcsV0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLFdBQVcsR0FBRyxXQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxELE9BQU8sSUFBSSxXQUFJLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzdDLENBQUM7Q0FDSjtBQTFGRCxvQkEwRkMifQ==
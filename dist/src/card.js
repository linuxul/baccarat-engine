"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
/**
 * Represents a single playing card.
 */
class Card {
    /**
     *
     * @param {string} suit The suit of the card
     * @param {string} value The value of the card
     */
    constructor(suit = 'diamond', value = 'A') {
        this.suit = suit;
        this.value = value;
    }
    /**
     * Returns a string representation of this card.
     * @return {string} The string representation of the card.
     */
    toString() {
        const suit = Card.StandardSuitUnicodeStrings[this.suit] || this.suit;
        return `[Card ${suit} ${this.value}]`;
    }
}
exports.Card = Card;
/**
 * Default values for cards in a standard playing deck.
 */
Card.DefaultValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
/**
 * Default suits for cards in a standard playing deck.
 */
Card.DefaultSuits = ['club', 'diamond', 'heart', 'spade'];
/**
 * Unicode conversion table for the standard suits of a playing deck.
 */
Card.StandardSuitUnicodeStrings = {
    heart: '♥',
    diamond: '♦',
    club: '♣',
    spade: '♠',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOztHQUVHO0FBQ0gsTUFBYSxJQUFJO0lBSWI7Ozs7T0FJRztJQUNILFlBQVksT0FBZSxTQUFTLEVBQUUsUUFBZ0IsR0FBRztRQUNyRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsUUFBUTtRQUNKLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyRSxPQUFPLFNBQVMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztJQUMxQyxDQUFDOztBQXJCTCxvQkEwQ0M7QUFuQkc7O0dBRUc7QUFDSSxrQkFBYSxHQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFFcEc7O0dBRUc7QUFDSSxpQkFBWSxHQUFhLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFdEU7O0dBRUc7QUFDSSwrQkFBMEIsR0FBOEI7SUFDM0QsS0FBSyxFQUFFLEdBQUc7SUFDVixPQUFPLEVBQUUsR0FBRztJQUNaLElBQUksRUFBRSxHQUFHO0lBQ1QsS0FBSyxFQUFFLEdBQUc7Q0FDYixDQUFDIn0=
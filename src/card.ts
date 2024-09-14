/**
 * Represents a single playing card.
 */
export class Card {
    suit: string;
    value: string;

    /**
     * 
     * @param {string} suit The suit of the card
     * @param {string} value The value of the card
     */
    constructor(suit: string = 'diamond', value: string = 'A') {
        this.suit = suit;
        this.value = value;
    }

    /**
     * Returns a string representation of this card.
     * @return {string} The string representation of the card.
     */
    toString(): string {
        const suit = Card.StandardSuitUnicodeStrings[this.suit] || this.suit;
        return `[Card ${suit} ${this.value}]`;
    }

    /**
     * Default values for cards in a standard playing deck.
     */
    static DefaultValues: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    /**
     * Default suits for cards in a standard playing deck.
     */
    static DefaultSuits: string[] = ['club', 'diamond', 'heart', 'spade'];

    /**
     * Unicode conversion table for the standard suits of a playing deck.
     */
    static StandardSuitUnicodeStrings: { [key: string]: string } = {
        heart: '♥',
        diamond: '♦',
        club: '♣',
        spade: '♠',
    };
}


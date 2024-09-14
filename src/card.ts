/**
 * Represents a single playing card.
 * 이 클래스는 하나의 카드를 나타냅니다. 각 카드는 특정 슈트(문양)와 값(숫자 또는 문자)을 가집니다.
 */
export class Card {
    suit: string;  // 카드의 문양 (heart, diamond, club, spade 중 하나)
    value: string; // 카드의 값 (A, 2, 3, ..., 10, J, Q, K)

    /**
     * Card 클래스의 생성자.
     * 주어진 문양(suit)과 값(value)을 기반으로 새로운 카드를 생성합니다.
     * 기본값으로는 다이아몬드(diamond) 슈트와 A 값의 카드를 생성합니다.
     * 
     * @param {string} suit 카드의 문양을 나타냅니다. 기본값은 'diamond'입니다.
     * @param {string} value 카드의 값을 나타냅니다. 기본값은 'A'입니다.
     */
    constructor(suit: string = 'diamond', value: string = 'A') {
        this.suit = suit;
        this.value = value;
    }

    /**
     * 카드의 문자열 표현을 반환합니다.
     * 이 메서드는 카드를 읽기 쉽고 의미 있게 표현할 수 있도록 `[Card ♥ A]`와 같은 형식의 문자열을 반환합니다.
     * 슈트는 유니코드 기호로 변환되어 표시됩니다.
     * 
     * @return {string} 카드의 문자열 표현 (예: [Card ♥ A])
     */
    toString(): string {
        // 슈트를 유니코드 문자로 변환하거나 기본 슈트를 사용
        const suit = Card.StandardSuitUnicodeStrings[this.suit] || this.suit;
        return `[Card ${suit} ${this.value}]`; // 카드의 슈트와 값을 포함한 문자열을 반환
    }

    /**
     * 기본 카드 값 목록을 저장하는 정적 필드.
     * 이 배열은 일반적인 덱에서 사용되는 13개의 카드 값(A, 2, 3, ..., 10, J, Q, K)을 정의합니다.
     * 
     * @type {string[]}
     */
    static DefaultValues: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    /**
     * 기본 카드 슈트 목록을 저장하는 정적 필드.
     * 이 배열은 일반적인 덱에서 사용되는 네 가지 슈트(club, diamond, heart, spade)를 정의합니다.
     * 
     * @type {string[]}
     */
    static DefaultSuits: string[] = ['club', 'diamond', 'heart', 'spade'];

    /**
     * 카드 슈트를 유니코드 문자로 변환하기 위한 매핑 테이블.
     * 이 객체는 각 슈트(heart, diamond, club, spade)를 그에 해당하는 유니코드 문자(♥, ♦, ♣, ♠)로 변환하는 데 사용됩니다.
     * 
     * @type {{ [key: string]: string }}
     */
    static StandardSuitUnicodeStrings: { [key: string]: string } = {
        heart: '♥',    // 하트 슈트를 유니코드 하트 기호로 변환
        diamond: '♦',  // 다이아몬드 슈트를 유니코드 다이아몬드 기호로 변환
        club: '♣',     // 클럽 슈트를 유니코드 클럽 기호로 변환
        spade: '♠',    // 스페이드 슈트를 유니코드 스페이드 기호로 변환
    };
}

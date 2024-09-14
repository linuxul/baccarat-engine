import { EventEmitter } from 'events';
import shuffleArray = require('shuffle-array');
import { Card } from './card';

const CutCardLengthFromBottom = 16; // 컷 카드가 덱 하단에서 16장 남았을 때 사용됨

/**
 * Shoe 클래스는 여러 덱의 카드를 포함하는 객체로, 바카라 게임에서 사용됩니다.
 * 이 클래스는 덱을 생성하고, 카드를 섞고, 카드를 뽑는 기능을 제공합니다.
 */
export class Shoe extends EventEmitter {
    decks: number; // 신발에 포함된 덱의 수
    cards: Card[]; // 현재 신발에 있는 카드 배열

    /**
     * 현재 남아 있는 카드의 수를 반환합니다.
     * @return {number} 남아 있는 카드의 수
     */
    get cardsLeft(): number {
        return this.cards.length;
    }

    /**
     * 컷 카드 이전에 남아 있는 카드의 수를 반환합니다.
     * 컷 카드가 배치된 위치에서 남은 카드를 추적하여, 게임이 언제 중단되어야 할지 알 수 있습니다.
     * @return {number} 컷 카드 이전에 남은 카드 수
     */
    get cardsBeforeCutCard(): number {
        return Math.max(0, this.cardsLeft - CutCardLengthFromBottom);
    }

    /**
     * 컷 카드에 도달했는지 여부를 반환합니다.
     * 게임 규칙에 따라, 컷 카드에 도달하면 게임을 중단하고 카드를 다시 섞어야 합니다.
     * @return {boolean} 컷 카드에 도달했으면 true, 그렇지 않으면 false
     */
    get cutCardReached(): boolean {
        return this.cardsBeforeCutCard <= 0;
    }

    /**
     * Shoe 클래스의 생성자.
     * 주어진 덱 수를 기반으로 신발을 초기화합니다.
     * 
     * @param {number} decks - 신발에 포함될 덱의 수
     */
    constructor(decks: number) {
        super(); // EventEmitter를 상속하므로, 부모 클래스의 생성자를 호출
        this.decks = decks; // 주어진 덱 수를 할당
        this.cards = [];    // 카드 배열을 빈 상태로 초기화
    }

    /**
     * 카드 배열을 생성합니다.
     * 주어진 덱 수에 따라 52장의 카드를 포함한 덱을 여러 개 생성하여 신발에 추가합니다.
     */
    createDecks(): void {
        for (let i = 0; i < this.decks; i++) { // 덱의 수만큼 반복
            for (let j = 0; j < 52; j++) {     // 각 덱에는 52장의 카드가 포함됨
                this.cards.push(this.createCard(j)); // 각 카드의 값을 생성하여 배열에 추가
            }
        }
    }

    /**
     * 카드 배열을 섞습니다.
     * 외부 모듈인 shuffle-array를 사용하여 카드 배열을 무작위로 섞습니다.
     */
    shuffle(): void {
        shuffleArray(this.cards);
    }

    /**
     * 신발에서 다음 카드를 뽑습니다.
     * 남아 있는 카드가 없으면 새로운 덱을 생성하고 카드를 섞은 후에 카드를 뽑습니다.
     * 
     * @return {Card | undefined} 뽑힌 카드 또는 카드가 없으면 undefined
     */
    draw(): Card | undefined {
        if (this.cards.length === 0) {
            this.createDecks(); // 덱이 비어 있으면 새로 생성
            this.shuffle();     // 카드를 섞음
        }
        return this.cards.pop(); // 카드 배열에서 마지막 카드를 반환 (제거)
    }

    /**
     * 신발의 상태를 문자열로 반환합니다.
     * 남아 있는 모든 카드를 문자열 형식으로 반환하여 신발의 현재 상태를 확인할 수 있습니다.
     * 
     * @return {string} 카드 배열의 문자열 표현
     */
    toString(): string {
        return `[${this.cards.map((c) => c.toString()).join(', ')}]`;
    }

    /**
     * 주어진 값으로부터 카드를 생성합니다.
     * 0에서 51까지의 숫자를 입력받아 해당하는 카드의 문양과 값을 계산하여 생성합니다.
     * 
     * @param {number} value - 생성할 카드의 정수 값 (0-51)
     * @return {Card} 생성된 카드
     */
    createCard(value: number): Card {
        const suit = Math.floor(value / 13); // 0-12: 클럽, 13-25: 다이아몬드, 26-38: 하트, 39-51: 스페이드
        const cardValue = value % 13;        // 카드 값은 0-12 범위로 계산됨

        const suitString = Card.DefaultSuits[suit];       // 카드 문양 문자열 가져오기
        const valueString = Card.DefaultValues[cardValue]; // 카드 값 문자열 가져오기

        return new Card(suitString, valueString); // 새로운 Card 객체를 생성하여 반환
    }
}

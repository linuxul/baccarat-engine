import { Card } from './card';

/**
 * Baccarat 게임의 플레이어와 뱅커의 카드를 나타냅니다.
 */
export class Hand {
    playerCards: Card[];
    bankerCards: Card[];

    /**
     * @param {Card[]} playerCards - 게임에서 플레이어의 카드
     * @param {Card[]} bankerCards - 게임에서 뱅커의 카드
     */
    constructor(playerCards: Card[] = [], bankerCards: Card[] = []) {
        this.playerCards = playerCards;
        this.bankerCards = bankerCards;
    }
}

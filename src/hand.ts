import { Card } from './card';

/**
 * Hand 클래스는 바카라 게임에서 플레이어와 뱅커가 소유한 카드를 나타냅니다.
 * 각 핸드는 플레이어와 뱅커의 카드 배열을 가지고 있으며, 이를 통해 게임의 진행 상태를 추적합니다.
 */
export class Hand {
    playerCards: Card[]; // 플레이어가 소유한 카드 목록
    bankerCards: Card[]; // 뱅커가 소유한 카드 목록

    /**
     * Hand 클래스의 생성자.
     * 플레이어와 뱅커가 소유한 카드를 초기화합니다.
     * 기본적으로 빈 카드 배열을 할당하지만, 필요에 따라 카드 목록을 전달할 수 있습니다.
     * 
     * @param {Card[]} playerCards - 플레이어가 소유한 카드 배열 (기본값은 빈 배열)
     * @param {Card[]} bankerCards - 뱅커가 소유한 카드 배열 (기본값은 빈 배열)
     */
    constructor(playerCards: Card[] = [], bankerCards: Card[] = []) {
        this.playerCards = playerCards;  // 플레이어의 카드 배열 초기화
        this.bankerCards = bankerCards;  // 뱅커의 카드 배열 초기화
    }
}

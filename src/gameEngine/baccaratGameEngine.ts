import { Hand } from '../hand';
import { BaccaratResultsEngine } from '../baccaratResultsEngine';
import { Shoe } from '../shoe';
import { Card } from '../card';

/**
 * Punto Banco 룰에 따라 바카라 게임을 진행하는 클래스
 */
export class BaccaratGameEngine {
    public resultsEngine: BaccaratResultsEngine; // 게임 결과 처리를 담당하는 엔진
    public shoe: Shoe; // 8덱으로 이루어진 카드 슈

    /**
     * BaccaratGameEngine 생성자
     * 게임 결과 처리 엔진과 8덱 슈를 초기화
     * @constructor
     */
    constructor() {
        this.resultsEngine = new BaccaratResultsEngine();
        this.shoe = new Shoe(8); // 기본적으로 8덱을 사용하는 슈를 생성
    }

    /**
     * 새로운 게임을 진행하기 위해 카드를 버닝해야 하는지 여부를 반환
     * 컷 카드에 도달했는지 여부를 확인
     * @return {boolean} 컷 카드에 도달하면 true, 그렇지 않으면 false
     */
    get isBurnNeeded(): boolean {
        return this.shoe.cutCardReached;
    }

    /**
     * 카드를 버닝하는 동작을 수행
     * 첫 번째 카드의 값에 따라 버닝할 카드 수를 결정
     * @return {Object} 버닝 동작에 대한 결과
     * @property {Card} burnCard 버닝을 시작하는 카드
     * @property {Card[]} burnCards 버닝된 카드 배열
     */
    burnCards(): { burnCard: Card, burnCards: Card[] } {
        const burnCard = this.shoe.draw(); // 첫 번째 버닝 카드
        const burnCards: Card[] = [];

        // 첫 번째 카드의 값을 가져와서 버닝할 카드 수 결정
        let burnCardValue = BaccaratResultsEngine.valueForCard(burnCard);

        // 페이스 카드와 10은 10으로 간주
        if (burnCardValue === 0) burnCardValue = 10;

        // 버닝할 카드 수만큼 슈에서 카드를 뽑아 배열에 저장
        for (let i = 0; i < burnCardValue; i++) {
            burnCards.push(this.shoe.draw());
        }

        return { burnCard, burnCards };
    }

    /**
     * 게임을 진행하는 함수
     * 플레이어와 뱅커에게 각각 2장의 카드를 분배한 후 필요에 따라 추가 카드 분배
     * @return {Hand} 게임 결과에 대한 카드 정보가 포함된 Hand 객체
     */
    dealGame(): Hand {
        // 플레이어와 뱅커에게 첫 번째 두 장의 카드를 분배
        const pCard1 = this.shoe.draw();
        const bCard1 = this.shoe.draw();
        const pCard2 = this.shoe.draw();
        const bCard2 = this.shoe.draw();

        const hand = new Hand();

        // 플레이어와 뱅커의 핸드에 각각 두 장의 카드를 추가
        hand.playerCards.push(pCard1, pCard2);
        hand.bankerCards.push(bCard1, bCard2);

        // 플레이어와 뱅커의 카드 값 계산
        let bankerCardsValue = this.resultsEngine.calculateHandValue(hand.bankerCards);
        let playerCardsValue = this.resultsEngine.calculateHandValue(hand.playerCards);

        let bankerDraw = false; // 뱅커가 추가로 카드를 뽑는지 여부

        // Natural (플레이어나 뱅커가 8 또는 9를 뽑은 경우) - 추가 카드 없이 게임 종료
        if (bankerCardsValue > 7 || playerCardsValue > 7) {
            return hand;

        // 플레이어의 점수가 6 또는 7이면 추가 카드를 뽑지 않음
        } else if (playerCardsValue > 5) {
            // 플레이어가 멈췄으므로 뱅커는 0-5이면 추가 카드를 뽑고 6 또는 7이면 멈춤
            if (bankerCardsValue <= 5) {
                bankerDraw = true;
            }

        // 플레이어가 0-5일 경우 3번째 카드를 뽑음
        } else {
            const player3rdCard = this.shoe.draw(); // 플레이어의 3번째 카드
            hand.playerCards.push(player3rdCard);
            const player3rdCardValue = BaccaratResultsEngine.valueForCard(player3rdCard);

            // 플레이어의 3번째 카드 값에 따라 뱅커가 카드를 뽑을지 여부 결정
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

        // 뱅커가 추가 카드를 뽑아야 하는 경우
        if (bankerDraw) {
            const banker3rdCard = this.shoe.draw();
            hand.bankerCards.push(banker3rdCard);
            bankerCardsValue = this.resultsEngine.calculateHandValue(hand.bankerCards);
        }

        return hand; // 게임 결과가 포함된 Hand 객체 반환
    }
}

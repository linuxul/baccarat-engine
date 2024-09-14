import { GameResult } from './gameResult'; // GameResult를 TypeScript로 변환된 파일로부터 가져옴

interface Card {
    suit: string;
    value: string;
}

interface Hand {
    playerCards?: Card[];
    bankerCards?: Card[];
}

/**
 * Baccarat 결과 계산 엔진
 * 게임 결과 및 내추럴과 페어 관련 정보 등을 계산합니다.
 */
export class BaccaratResultsEngine {

    /**
     * Baccarat 게임 결과를 계산합니다.
     * @param {Hand} hand - Baccarat 게임에서 사용된 패 정보
     * @return {GameResult} 계산된 게임 결과
     */
    calculateGameResult(hand: Hand): GameResult {
        let result: GameResult = {
            outcome: GameResult.Tie,
            natural: GameResult.NoNatural,
            pair: GameResult.NoPair,
        };

        result.outcome = this.calculateOutcome(hand);
        result.natural = this.calculateNatural(result.outcome, hand);
        result.pair = this.calculatePairs(hand);

        return result;
    }

    /**
     * 게임에서 승리한 주요 베팅을 계산합니다.
     * @param {Hand} hand - Baccarat 게임에서 사용된 패 정보
     * @return {string} 승리한 베팅 결과 (Player, Banker, Tie 중 하나)
     */
    calculateOutcome({ playerCards = [], bankerCards = [] }: Hand): string {
        const playerValue = this.calculateHandValue(playerCards);
        const bankerValue = this.calculateHandValue(bankerCards);

        const difference = bankerValue - playerValue;

        if (difference === 0) return GameResult.Tie;
        else if (difference > 0) return GameResult.Banker;
        else return GameResult.Player;
    }

    /**
     * 게임에서 승리한 내추럴 베팅을 계산합니다.
     * @param {string} outcome - 게임 결과
     * @param {Hand} hand - Baccarat 게임에서 사용된 패 정보
     * @return {string} 내추럴 베팅 결과
     */
    calculateNatural(outcome: string, { playerCards = [], bankerCards = [] }: Hand): string {
        let cardsToCheck: Card[];

        switch (outcome) {
            case GameResult.Player:
                cardsToCheck = playerCards;
                break;
            case GameResult.Banker:
                cardsToCheck = bankerCards;
                break;
            default:
                return GameResult.NoNatural;
        }

        if (cardsToCheck.length === 2) {
            const handValue = this.calculateHandValue(cardsToCheck);

            if (handValue === 8) return `${outcome}8`;
            else if (handValue === 9) return `${outcome}9`;
        }

        return GameResult.NoNatural;
    }

    /**
     * 게임에서 승리한 페어 베팅을 계산합니다.
     * @param {Hand} hand - Baccarat 게임에서 사용된 패 정보
     * @return {string} 페어 베팅 결과
     */
    calculatePairs({ playerCards = [], bankerCards = [] }: Hand): string {
        const isPlayerPair = this.calculatePair(playerCards);
        const isBankerPair = this.calculatePair(bankerCards);

        if (isPlayerPair && isBankerPair) return GameResult.BothPair;
        else if (isPlayerPair) return GameResult.PlayerPair;
        else if (isBankerPair) return GameResult.BankerPair;
        else return GameResult.NoPair;
    }

    /**
     * 패에서 페어 여부를 계산합니다.
     * @param {Card[]} cards - 페어를 확인할 카드 배열
     * @return {boolean} 페어인지 여부
     */
    private calculatePair(cards: Card[]): boolean {
        if (cards.length !== 2) return false;

        const [firstCard, secondCard] = cards;
        return firstCard.value === secondCard.value;
    }

    /**
     * Baccarat 게임에서 사용된 카드의 값을 계산합니다.
     * @param {Card[]} cards - Baccarat 게임에서 사용된 카드 배열
     * @return {number} 카드 값 (0 ~ 9)
     */
    private calculateHandValue(cards: Card[]): number {
        const cardsValue = cards.reduce((handValue, card) => {
            return BaccaratResultsEngine.valueForCard(card) + handValue;
        }, 0);

        return cardsValue % 10;
    }

    /**
     * 주어진 카드의 Baccarat 값을 반환합니다.
     * @param {Card} card - Baccarat 게임에서 사용된 카드
     * @return {number} Baccarat 카드 값
     */
    static valueForCard({ suit, value = '0' }: Card): number {
        switch (value) {
            case 'A': return 1;
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case '8': return 8;
            case '9': return 9;
            case '10':
            case 'J':
            case 'Q':
            case 'K':
                return 0;
            default: return 0;
        }
    }
}

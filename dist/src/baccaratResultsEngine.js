"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaccaratResultsEngine = void 0;
const gameResult_1 = require("./gameResult"); // GameResult를 TypeScript로 변환된 파일로부터 가져옴
/**
 * Baccarat 결과 계산 엔진
 * 게임 결과 및 내추럴과 페어 관련 정보 등을 계산합니다.
 */
class BaccaratResultsEngine {
    /**
     * Baccarat 게임 결과를 계산합니다.
     * @param {Hand} hand - Baccarat 게임에서 사용된 패 정보
     * @return {GameResult} 계산된 게임 결과
     */
    calculateGameResult(hand) {
        let result = {
            outcome: gameResult_1.GameResult.Tie,
            natural: gameResult_1.GameResult.NoNatural,
            pair: gameResult_1.GameResult.NoPair,
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
    calculateOutcome({ playerCards = [], bankerCards = [] }) {
        const playerValue = this.calculateHandValue(playerCards);
        const bankerValue = this.calculateHandValue(bankerCards);
        const difference = bankerValue - playerValue;
        if (difference === 0)
            return gameResult_1.GameResult.Tie;
        else if (difference > 0)
            return gameResult_1.GameResult.Banker;
        else
            return gameResult_1.GameResult.Player;
    }
    /**
     * 게임에서 승리한 내추럴 베팅을 계산합니다.
     * @param {string} outcome - 게임 결과
     * @param {Hand} hand - Baccarat 게임에서 사용된 패 정보
     * @return {string} 내추럴 베팅 결과
     */
    calculateNatural(outcome, { playerCards = [], bankerCards = [] }) {
        let cardsToCheck;
        switch (outcome) {
            case gameResult_1.GameResult.Player:
                cardsToCheck = playerCards;
                break;
            case gameResult_1.GameResult.Banker:
                cardsToCheck = bankerCards;
                break;
            default:
                return gameResult_1.GameResult.NoNatural;
        }
        if (cardsToCheck.length === 2) {
            const handValue = this.calculateHandValue(cardsToCheck);
            if (handValue === 8)
                return `${outcome}8`;
            else if (handValue === 9)
                return `${outcome}9`;
        }
        return gameResult_1.GameResult.NoNatural;
    }
    /**
     * 게임에서 승리한 페어 베팅을 계산합니다.
     * @param {Hand} hand - Baccarat 게임에서 사용된 패 정보
     * @return {string} 페어 베팅 결과
     */
    calculatePairs({ playerCards = [], bankerCards = [] }) {
        const isPlayerPair = this.calculatePair(playerCards);
        const isBankerPair = this.calculatePair(bankerCards);
        if (isPlayerPair && isBankerPair)
            return gameResult_1.GameResult.BothPair;
        else if (isPlayerPair)
            return gameResult_1.GameResult.PlayerPair;
        else if (isBankerPair)
            return gameResult_1.GameResult.BankerPair;
        else
            return gameResult_1.GameResult.NoPair;
    }
    /**
     * 패에서 페어 여부를 계산합니다.
     * @param {Card[]} cards - 페어를 확인할 카드 배열
     * @return {boolean} 페어인지 여부
     */
    calculatePair(cards) {
        if (cards.length !== 2)
            return false;
        const [firstCard, secondCard] = cards;
        return firstCard.value === secondCard.value;
    }
    /**
     * Baccarat 게임에서 사용된 카드의 값을 계산합니다.
     * @param {Card[]} cards - Baccarat 게임에서 사용된 카드 배열
     * @return {number} 카드 값 (0 ~ 9)
     */
    calculateHandValue(cards) {
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
    static valueForCard({ suit, value = '0' }) {
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
exports.BaccaratResultsEngine = BaccaratResultsEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFjY2FyYXRSZXN1bHRzRW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JhY2NhcmF0UmVzdWx0c0VuZ2luZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMEMsQ0FBQyx3Q0FBd0M7QUFZbkY7OztHQUdHO0FBQ0gsTUFBYSxxQkFBcUI7SUFFOUI7Ozs7T0FJRztJQUNILG1CQUFtQixDQUFDLElBQVU7UUFDMUIsSUFBSSxNQUFNLEdBQWU7WUFDckIsT0FBTyxFQUFFLHVCQUFVLENBQUMsR0FBRztZQUN2QixPQUFPLEVBQUUsdUJBQVUsQ0FBQyxTQUFTO1lBQzdCLElBQUksRUFBRSx1QkFBVSxDQUFDLE1BQU07U0FDMUIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsZ0JBQWdCLENBQUMsRUFBRSxXQUFXLEdBQUcsRUFBRSxFQUFFLFdBQVcsR0FBRyxFQUFFLEVBQVE7UUFDekQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV6RCxNQUFNLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBRTdDLElBQUksVUFBVSxLQUFLLENBQUM7WUFBRSxPQUFPLHVCQUFVLENBQUMsR0FBRyxDQUFDO2FBQ3ZDLElBQUksVUFBVSxH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
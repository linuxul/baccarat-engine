"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hand = void 0;
/**
 * Baccarat 게임의 플레이어와 뱅커의 카드를 나타냅니다.
 */
class Hand {
    /**
     * @param {Card[]} playerCards - 게임에서 플레이어의 카드
     * @param {Card[]} bankerCards - 게임에서 뱅커의 카드
     */
    constructor(playerCards = [], bankerCards = []) {
        this.playerCards = playerCards;
        this.bankerCards = bankerCards;
    }
}
exports.Hand = Hand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBOztHQUVHO0FBQ0gsTUFBYSxJQUFJO0lBSWI7OztPQUdHO0lBQ0gsWUFBWSxjQUFzQixFQUFFLEVBQUUsY0FBc0IsRUFBRTtRQUMxRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUNuQyxDQUFDO0NBQ0o7QUFaRCxvQkFZQyJ9
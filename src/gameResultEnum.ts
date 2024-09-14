/**
 * 게임의 결과를 나타내는 열거형.
 * 게임이 끝났을 때, 승리자가 플레이어, 뱅커 또는 무승부인지 결정하는 데 사용됩니다.
 */
export const enum GameResultOutcomes {
    Player = "player",  // 플레이어가 승리한 경우
    Banker = "banker",  // 뱅커가 승리한 경우
    Tie = "tie",        // 게임이 무승부로 끝난 경우
}

/**
 * 자연승 상태를 나타내는 열거형.
 * 자연승이란 플레이어나 뱅커가 첫 두 장의 카드로 8 또는 9를 획득하여 승리하는 경우를 말합니다.
 */
export const enum GameResultNatural {
    PlayerNatural8 = "player8",  // 플레이어가 8로 자연승한 경우
    PlayerNatural9 = "player9",  // 플레이어가 9로 자연승한 경우
    BankerNatural8 = "banker8",  // 뱅커가 8로 자연승한 경우
    BankerNatural9 = "banker9",  // 뱅커가 9로 자연승한 경우
    NoNatural = "none",          // 자연승이 발생하지 않은 경우
}

/**
 * 페어 베팅의 결과를 나타내는 열거형.
 * 페어는 같은 값의 두 카드를 가지는 상태를 의미하며, 플레이어나 뱅커가 페어인지 여부를 나타냅니다.
 */
export const enum GameResultPair {
    PlayerPair = "player",  // 플레이어가 페어인 경우
    BankerPair = "banker",  // 뱅커가 페어인 경우
    BothPair = "both",      // 플레이어와 뱅커 모두 페어인 경우
    NoPair = "none",        // 페어가 발생하지 않은 경우
}

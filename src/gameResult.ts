/**
 * GameResult 클래스는 단일 게임의 결과를 나타냅니다.
 * outcome(결과), natural(자연승), pair(페어) 상태에 대한 정보를 저장하며, 
 * 해당 게임에서 발생한 다양한 상황에 대해 상세하게 설명할 수 있습니다.
 */
export class GameResult {
    outcome?: string; // 게임의 최종 결과를 나타냄 (플레이어 승, 뱅커 승, 무승부 중 하나)
    natural?: string; // 자연승 상태를 나타냄 (플레이어나 뱅커가 8 또는 9로 자연승한 경우)
    pair?: string;    // 페어 베팅 상태를 나타냄 (플레이어, 뱅커, 또는 양쪽이 페어일 경우)

    /**
     * 게임 결과에 대한 상수 정의.
     * 각 상수는 게임 결과의 세 가지 주요 상태를 나타냅니다.
     */
    static Tie: string = 'tie';          // 무승부를 의미
    static Banker: string = 'banker';    // 뱅커가 승리한 게임 결과를 의미
    static Player: string = 'player';    // 플레이어가 승리한 게임 결과를 의미

    /**
     * 자연승에 대한 상수 정의.
     * 플레이어 또는 뱅커가 처음 두 장의 카드로 8 또는 9의 값을 획득한 경우, 이를 자연승이라고 합니다.
     */
    static PlayerNatural8: string = 'player8';    // 플레이어가 8로 자연승
    static PlayerNatural9: string = 'player9';    // 플레이어가 9로 자연승
    static BankerNatural8: string = 'banker8';    // 뱅커가 8로 자연승
    static BankerNatural9: string = 'banker9';    // 뱅커가 9로 자연승
    static NoNatural: string = 'none';            // 자연승이 없는 경우

    /**
     * 페어 상태에 대한 상수 정의.
     * 페어는 같은 값의 두 카드를 가진 상태를 의미합니다. 플레이어와 뱅커 모두 페어를 가질 수 있습니다.
     */
    static PlayerPair: string = 'player';    // 플레이어가 페어일 때
    static BankerPair: string = 'banker';    // 뱅커가 페어일 때
    static BothPair: string = 'both';        // 플레이어와 뱅커 둘 다 페어일 때
    static NoPair: string = 'none';          // 페어가 없을 때
}

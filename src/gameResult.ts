/**
 * @property {string} outcome The outcome of the game
 * @property {string} natural The status of a natural bet on this game
 * @property {string} pair The status of the pair bet on this game
 */
export class GameResult {
    outcome?: string;
    natural?: string;
    pair?: string;

    // 게임 결과 상수
    static Tie: string = 'tie';
    static Banker: string = 'banker';
    static Player: string = 'player';

    // 자연 승 상수
    static PlayerNatural8: string = 'player8';
    static PlayerNatural9: string = 'player9';
    static BankerNatural8: string = 'banker8';
    static BankerNatural9: string = 'banker9';
    static NoNatural: string = 'none';

    // 페어 상수
    static PlayerPair: string = 'player';
    static BankerPair: string = 'banker';
    static BothPair: string = 'both';
    static NoPair: string = 'none';
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameResult = void 0;
/**
 * @property {string} outcome The outcome of the game
 * @property {string} natural The status of a natural bet on this game
 * @property {string} pair The status of the pair bet on this game
 */
class GameResult {
}
exports.GameResult = GameResult;
// 게임 결과 상수
GameResult.Tie = 'tie';
GameResult.Banker = 'banker';
GameResult.Player = 'player';
// 자연 승 상수
GameResult.PlayerNatural8 = 'player8';
GameResult.PlayerNatural9 = 'player9';
GameResult.BankerNatural8 = 'banker8';
GameResult.BankerNatural9 = 'banker9';
GameResult.NoNatural = 'none';
// 페어 상수
GameResult.PlayerPair = 'player';
GameResult.BankerPair = 'banker';
GameResult.BothPair = 'both';
GameResult.NoPair = 'none';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZVJlc3VsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nYW1lUmVzdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7O0dBSUc7QUFDSCxNQUFhLFVBQVU7O0FBQXZCLGdDQXNCQztBQWpCRyxXQUFXO0FBQ0osY0FBRyxHQUFXLEtBQUssQ0FBQztBQUNwQixpQkFBTSxHQUFXLFFBQVEsQ0FBQztBQUMxQixpQkFBTSxHQUFXLFFBQVEsQ0FBQztBQUVqQyxVQUFVO0FBQ0gseUJBQWMsR0FBVyxTQUFTLENBQUM7QUFDbkMseUJBQWMsR0FBVyxTQUFTLENBQUM7QUFDbkMseUJBQWMsR0FBVyxTQUFTLENBQUM7QUFDbkMseUJBQWMsR0FBVyxTQUFTLENBQUM7QUFDbkMsb0JBQVMsR0FBVyxNQUFNLENBQUM7QUFFbEMsUUFBUTtBQUNELHFCQUFVLEdBQVcsUUFBUSxDQUFDO0FBQzlCLHFCQUFVLEdBQVcsUUFBUSxDQUFDO0FBQzlCLG1CQUFRLEdBQVcsTUFBTSxDQUFDO0FBQzFCLGlCQUFNLEdBQVcsTUFBTSxDQUFDIn0=
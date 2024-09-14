"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
/* eslint-disable no-console */
const roadmapGenerator_1 = require("./src/roadmaps/roadmapGenerator");
const baccaratGameEngine_1 = require("./src/gameEngine/baccaratGameEngine");
// import { Shoe } from './src/shoe';
// RoadmapGenerator 인스턴스 생성
const roadmapGenerator = new roadmapGenerator_1.RoadmapGenerator();
// BaccaratGameEngine 인스턴스 생성 (기본 8 덱)
const gameEngine = new baccaratGameEngine_1.BaccaratGameEngine();
gameEngine.shoe.createDecks();
gameEngine.shoe.shuffle();
// Burn cards 처리
let burnCard = gameEngine.burnCards();
console.log('burnCard = ', JSON.stringify(burnCard));
// 게임 결과 배열 선언
const gameResults = [];
for (let i = 0; i < 20; i += 1) {
    if (gameEngine.isBurnNeeded) {
        gameEngine.shoe.shuffle();
        // Burn card는 사용될 버닝 카드를 결정하는 첫 번째 카드입니다.
        burnCard = gameEngine.burnCards();
        console.log('burnCard = ', JSON.stringify(burnCard));
    }
    // 게임 진행
    const hand = gameEngine.dealGame();
    // console.log('Hand = ', JSON.stringify(hand));
    // 게임 결과 계산
    const result = gameEngine.resultsEngine.calculateGameResult(hand);
    console.log('result = ', JSON.stringify(result));
    // 게임 결과 저장
    gameResults.push(result);
    // BeadPlate 생성
    const beadPlate = roadmapGenerator.beadPlate(gameResults, {
        columns: 20,
        rows: 6,
    });
    // BigRoad 생성
    const bigRoad = roadmapGenerator.bigRoad(gameResults);
    console.log('beadPlate = ', JSON.stringify(beadPlate));
    console.log('bigRoad = ', JSON.stringify(bigRoad));
    // Big Eye Road 생성
    const bigEye = roadmapGenerator.bigEyeRoad(bigRoad);
    console.log('bigEye = ', JSON.stringify(bigEye));
    // Small Road 생성
    const smallRoad = roadmapGenerator.smallRoad(bigRoad);
    console.log('smallRoad = ', JSON.stringify(smallRoad));
    // Cockroach Pig Road 생성
    const cockroachPig = roadmapGenerator.cockroachPig(bigRoad);
    console.log('cockroachPig = ', JSON.stringify(cockroachPig));
}
// 게임 결과 출력
console.log('gameResults = ', JSON.stringify(gameResults));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLXVzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2FtcGxlLXVzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTRCO0FBQzVCLCtCQUErQjtBQUMvQixzRUFBbUU7QUFDbkUsNEVBQXlFO0FBR3pFLHFDQUFxQztBQUVyQywyQkFBMkI7QUFDM0IsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixFQUFFLENBQUM7QUFFaEQsc0NBQXNDO0FBQ3RDLE1BQU0sVUFBVSxHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztBQUM1QyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzlCLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFFMUIsZ0JBQWdCO0FBQ2hCLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFFckQsY0FBYztBQUNkLE1BQU0sV0FBVyxHQUFpQixFQUFFLENBQUM7QUFFckMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ2hDLElBQUksVUFBVSxDQUFDLFlBQVksRUFBRTtRQUN6QixVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzFCLHlDQUF5QztRQUN6QyxRQUFRLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUN4RDtJQUVELFFBQVE7SUFDUixNQUFNLElBQUksR0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekMsZ0RBQWdEO0lBRWhELFdBQVc7SUFDWCxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUVqRCxXQUFXO0lBQ1gsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV6QixlQUFlO0lBQ2YsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRTtRQUN0RCxPQUFPLEVBQUUsRUFBRTtRQUNYLElBQUksRUFBRSxDQUFDO0tBQ1YsQ0FBQyxDQUFDO0lBRUgsYUFBYTtJQUNiLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRW5ELGtCQUFrQjtJQUNsQixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRWpELGdCQUFnQjtJQUNoQixNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRXZELHdCQUF3QjtJQUN4QixNQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Q0FDNUQ7QUFFRCxXQUFXO0FBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMifQ==
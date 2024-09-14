/* eslint-disable max-len */
/* eslint-disable no-console */
import { RoadmapGenerator } from './src/roadmaps/roadmapGenerator';
import { BaccaratGameEngine } from './src/gameEngine/baccaratGameEngine';
import { GameResult } from './src/gameResult';
import { Hand } from './src/hand';
// import { Shoe } from './src/shoe';

// RoadmapGenerator 인스턴스 생성
const roadmapGenerator = new RoadmapGenerator();

// BaccaratGameEngine 인스턴스 생성 (기본 8 덱)
const gameEngine = new BaccaratGameEngine();
gameEngine.shoe.createDecks();
gameEngine.shoe.shuffle();

// Burn cards 처리
let burnCard = gameEngine.burnCards();
console.log('burnCard = ', JSON.stringify(burnCard));

// 게임 결과 배열 선언
const gameResults: GameResult[] = [];

for (let i = 0; i < 20; i += 1) {
if (gameEngine.isBurnNeeded) {
    gameEngine.shoe.shuffle();
    // Burn card는 사용될 버닝 카드를 결정하는 첫 번째 카드입니다.
    burnCard = gameEngine.burnCards();
    console.log('burnCard = ', JSON.stringify(burnCard));
}

// 게임 진행
const hand: Hand = gameEngine.dealGame();
console.log('Hand = ', JSON.stringify(hand));

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

/* eslint-disable max-len */

const _ = require('lodash'); // lodash 모듈을 CommonJS 방식으로 가져옴
import { GameResult } from '../gameResult.js';

// BeadPlate 및 BeadPlateConfig의 타입 정의
interface BeadPlate {
    result: GameResult; // 게임 결과를 저장하는 필드
    column: number; // 해당 결과가 위치하는 열 번호
    row: number; // 해당 결과가 위치하는 행 번호
}

interface BeadPlateConfig {
    columns?: number; // 비즈판의 열 개수 설정 (기본값은 6)
    rows?: number; // 비즈판의 행 개수 설정 (기본값은 6)
}

// BigRoad 및 관련 타입 정의
interface BigRoadItem {
    result: GameResult; // 게임 결과를 저장하는 필드
    column: number; // 해당 결과가 위치하는 열 번호
    row: number; // 해당 결과가 위치하는 행 번호
    logicalColumn: number; // 논리적인 열 번호, 결과가 나오는 순서대로 지정됨
    ties: GameResult[]; // Tie(무승부) 결과를 저장하는 배열
}

interface BigRoadConfig {
    columns?: number; // 빅 로드의 열 개수 설정 (기본값은 12)
    rows?: number; // 빅 로드의 행 개수 설정 (기본값은 6)
    scroll?: boolean; // 빅 로드가 스크롤 가능한지 여부 (기본값은 true)
}

// 각 열의 논리적인 정보를 저장하는 딕셔너리 타입
interface ColumnDictionary {
    logicalColumn: number; // 논리적인 열 번호
    logicalColumnDepth: number; // 해당 열의 깊이 (행 개수)
    outcome: string; // 해당 열의 결과 (플레이어 승, 뱅커 승 등)
}

/**
 * 바카라의 다양한 로드맵을 생성하는 클래스
 */
export class RoadmapGenerator {

    /**
     * RoadmapGenerator 생성자
     * @constructor
     */
    constructor() {
    }

    /**
     * 게임 결과를 기반으로 비즈판(6x6)에 해당하는 로드맵을 계산함.
     * @param {GameResult[]} gameResults 게임 결과 배열, 계산할 로드맵의 기준이 됨.
     * @param {BeadPlateConfig} config 비즈판의 그리기 옵션을 설정하는 객체.
     * @return {BeadPlate[]} 비즈판을 그리기 위한 데이터 배열.
     */
    beadPlate(gameResults: GameResult[] = [], { columns = 6, rows = 6 }: BeadPlateConfig): BeadPlate[] {
        const DisplayEntries = columns * rows; // 비즈판에 표시할 항목 수 (열 x 행)
        const ColumnSize = rows; // 비즈판의 한 열당 행의 개수

        // gameResults 배열에서 최신 항목들을 가져와 비즈판에 표시할 수 있도록 제한함
        gameResults = _.takeRight(gameResults, DisplayEntries);

        // 각 게임 결과를 비즈판에 매핑하여 배열로 반환
        return _.range(0, gameResults.length).map((index) => ({
            result: gameResults[index] || ({} as GameResult), // 결과가 없으면 빈 객체 할당
            column: this.columnForGameNumber(index, ColumnSize), // 게임 번호에 따라 열 번호 계산
            row: this.rowForGameNumber(index, ColumnSize), // 게임 번호에 따라 행 번호 계산
        }));
    }

    /**
     * 게임 결과를 기반으로 빅 로드를 계산함.
     * @param {GameResult[]} gameResults 게임 결과 배열, 빅 로드를 계산할 기준.
     * @param {BigRoadConfig} config 빅 로드의 그리기 옵션을 설정하는 객체.
     * @return {BigRoadItem[]} 빅 로드를 그리기 위한 데이터 배열.
     */
    bigRoad(gameResults: GameResult[] = [], { columns = 12, rows = 6, scroll = true }: BigRoadConfig = {}): BigRoadItem[] {
        let tieStack: GameResult[] = []; // 무승부 결과를 저장할 배열
        let placementMap: Record<string, BigRoadItem> = {}; // 빅 로드의 각 위치를 저장하는 맵
        let logicalColumnNumber = 0; // 현재 논리적인 열 번호
        let lastItem: GameResult | undefined; // 마지막 처리된 게임 결과
        let returnList: BigRoadItem[] = []; // 반환할 빅 로드 항목 배열
        let maximumColumnReached = 0; // 가장 멀리 도달한 열 번호

        // 각 게임 결과를 순회하며 빅 로드의 항목을 계산
        gameResults.forEach((gameResult) => {
            if (gameResult.outcome === GameResult.Tie) {
                // 무승부인 경우, tieStack에 추가
                tieStack.push(gameResult);
            } else {
                // 이전에 처리된 항목이 있는지 확인
                if (lastItem) {
                    let lastItemInResults = _.last(returnList); // 반환할 리스트에서 마지막 항목을 가져옴
                    if (lastItem.outcome === GameResult.Tie) {
                        // 마지막 항목이 무승부였을 경우, tieStack을 업데이트
                        if (lastItemInResults) {
                            lastItemInResults.ties = _.cloneDeep(tieStack);
                            tieStack = [];
                            // 결과가 다를 경우, 새로운 열로 이동
                            if (lastItemInResults.result.outcome !== gameResult.outcome) {
                                logicalColumnNumber++;
                            }
                        }
                    } else if (lastItem.outcome !== gameResult.outcome) {
                        // 마지막 결과와 현재 결과가 다르면 열을 이동하고 tieStack을 초기화
                        logicalColumnNumber++;
                        tieStack = [];
                    } else {
                        tieStack = []; // 결과가 같을 경우 tieStack만 초기화
                    }
                }

                // 새로운 빅 로드 항목을 생성하기 위해 빈 공간을 탐색
                let probeColumn = logicalColumnNumber;
                let probeRow = 0;
                let done = false;

                while (!done) {
                    let keySearch = `${probeColumn}.${probeRow}`; // 현재 열과 행에 대한 키 생성
                    let keySearchBelow = `${probeColumn}.${probeRow + 1}`; // 아래 행에 대한 키 생성

                    // 현재 위치가 비어 있으면 새로운 항목을 추가
                    if (!_.get(placementMap, keySearch)) {
                        let newEntry: BigRoadItem = {
                            row: probeRow,
                            column: probeColumn,
                            logicalColumn: logicalColumnNumber,
                            ties: _.cloneDeep(tieStack),
                            result: gameResult,
                        };
                        _.set(placementMap, keySearch, newEntry);
                        returnList.push(newEntry);
                        done = true; // 항목이 추가되면 탐색 종료
                    } else if (probeRow + 1 >= rows) {
                        // 행이 넘치면 다음 열로 이동
                        probeColumn++;
                    } else if (!_.get(placementMap, keySearchBelow)) {
                        // 아래 행이 비어 있으면 행을 증가시킴
                        probeRow++;
                    } else if (_.get(placementMap, keySearchBelow)?.result.outcome === gameResult.outcome) {
                        // 아래 행의 결과가 현재 결과와 같으면 행을 증가시킴
                        probeRow++;
                    } else {
                        // 그 외의 경우 열을 증가시킴
                        probeColumn++;
                    }
                }

                // 가장 멀리 도달한 열 번호를 기록
                maximumColumnReached = Math.max(maximumColumnReached, probeColumn);
            }

            // 마지막 처리된 항목을 업데이트
            lastItem = gameResult;
        });

        // Tie만 발생한 경우 처리
        if (_.isEmpty(returnList) && tieStack.length > 0) {
            returnList.push({
                ties: _.cloneDeep(tieStack),
                column: 0,
                row: 0,
                logicalColumn: 0,
                result: {} as GameResult,
            });
        } else if (!_.isEmpty(returnList)) {
            _.last(returnList)!.ties = _.cloneDeep(tieStack); // 마지막 항목에 남은 tieStack을 추가
        }

        // 스크롤이 가능하면 스크롤 처리
        if (scroll) {
            returnList = this.scrollBigRoad(returnList, maximumColumnReached, columns);
        }

        return returnList; // 계산된 빅 로드 항목을 반환
    }

    /**
     * 빅 로드의 각 열에 대한 정의를 반환
     * @param {BigRoadItem[]} bigRoad 빅 로드 데이터를 입력.
     * @return {Record<number, ColumnDictionary>} 열에 대한 딕셔너리.
     */
    bigRoadColumnDefinitions(bigRoad: BigRoadItem[]): Record<number, ColumnDictionary> {
        let columnDictionary: Record<number, ColumnDictionary> = {};

        // 빅 로드의 각 항목을 순회하면서 열 정의를 생성
        bigRoad.forEach((item) => {
            if (!_.has(columnDictionary, item.logicalColumn)) {
                columnDictionary[item.logicalColumn] = {
                    logicalColumn: item.logicalColumn,
                    logicalColumnDepth: 1,
                    outcome: item.result.outcome,
                };
            } else {
                // 같은 열에 결과가 추가되면 열의 깊이를 증가시킴
                columnDictionary[item.logicalColumn].logicalColumnDepth++;
            }
        });

        return columnDictionary; // 열 정의를 반환
    }

    /**
     * 주어진 주기를 사용하여 파생 로드를 생성함.
     * @param {BigRoadItem[]} bigRoad 빅 로드 데이터를 입력.
     * @param {number} cycleLength 파생 로드를 계산할 때 사용하는 주기.
     * @return {string[]} 파생 로드 항목의 리스트.
     */
    derivedRoad(bigRoad: BigRoadItem[], cycleLength: number): string[] {
        let columnDefinitions = this.bigRoadColumnDefinitions(bigRoad); // 열 정의 생성
        let k = cycleLength; // 주기를 설정
        let outcomes: string[] = []; // 결과를 저장할 배열

        // 각 열을 순회하면서 파생 로드를 계산
        Object.values(columnDefinitions).forEach((bigRoadColumn) => {
            let outcome = 'blue'; // 기본적으로 파란색
            let n = bigRoadColumn.logicalColumn; // 열 번호

            for (let m = 0; m < bigRoadColumn.logicalColumnDepth; m++) {
                let rowMDepth = m + 1; // 현재 행의 깊이

                if (rowMDepth >= 2) {
                    // 주기 길이만큼 이전 열을 비교
                    let compareColumn = n - k;
                    if (compareColumn <= 0) continue;

                    let pColumn = columnDefinitions[compareColumn]; // 비교할 열
                    if (!pColumn) continue;

                    let p = pColumn.logicalColumnDepth; // 비교 열의 깊이
                    if (rowMDepth <= p) {
                        outcome = 'red'; // 행 깊이가 같거나 작으면 빨간색
                    } else if (rowMDepth === p + 1) {
                        outcome = 'blue'; // 1칸 크면 파란색
                    } else if (rowMDepth > p + 1) {
                        outcome = 'red'; // 1칸보다 크면 빨간색
                    }

                    outcomes.push(outcome); // 결과를 저장
                } else {
                    // 첫 번째 행인 경우 처리
                    let kDistanceColumn = n - (k + 1); // 주기 길이만큼 떨어진 열
                    let leftColumn = n - 1; // 왼쪽 열

                    let kDistanceColumnDefinition = columnDefinitions[kDistanceColumn]; // 주기 거리 열 정의
                    let leftColumnDefinition = columnDefinitions[leftColumn]; // 왼쪽 열 정의

                    if (kDistanceColumnDefinition && leftColumnDefinition) {
                        // 주기 거리 열과 왼쪽 열의 깊이가 같으면 빨간색, 다르면 파란색
                        if (kDistanceColumnDefinition.logicalColumnDepth === leftColumnDefinition.logicalColumnDepth) {
                            outcome = 'red';
                        } else {
                            outcome = 'blue';
                        }

                        outcomes.push(outcome);
                    }
                }
            }
        });

        return outcomes; // 파생 로드 결과 반환
    }

    /**
     * Big Eye Road를 생성
     * @param {BigRoadItem[]} bigRoad 빅 로드 데이터
     * @return {string[]} Big Eye Road 결과
     */
    bigEyeRoad(bigRoad: BigRoadItem[]): string[] {
        return this.derivedRoad(bigRoad, 1); // 주기 1로 파생 로드를 계산
    }

    /**
     * Small Road를 생성
     * @param {BigRoadItem[]} bigRoad 빅 로드 데이터
     * @return {string[]} Small Road 결과
     */
    smallRoad(bigRoad: BigRoadItem[]): string[] {
        return this.derivedRoad(bigRoad, 2); // 주기 2로 파생 로드를 계산
    }

    /**
     * Cockroach Pig Road를 생성
     * @param {BigRoadItem[]} bigRoad 빅 로드 데이터
     * @return {string[]} Cockroach Pig Road 결과
     */
    cockroachPig(bigRoad: BigRoadItem[]): string[] {
        return this.derivedRoad(bigRoad, 3); // 주기 3으로 파생 로드를 계산
    }

    /**
     * 스크롤 가능한 빅 로드를 생성
     * @param {BigRoadItem[]} results 빅 로드 항목 리스트
     * @param {number} highestDrawingColumn 현재까지 그린 최대 열 번호
     * @param {number} drawingColumns 화면에 표시할 열 개수
     * @return {BigRoadItem[]} 스크롤된 빅 로드 항목 리스트
     */
    scrollBigRoad(results: BigRoadItem[] = [], highestDrawingColumn: number, drawingColumns: number): BigRoadItem[] {
        const highestDrawableIndex = drawingColumns - 1; // 표시할 수 있는 가장 높은 열 인덱스
        const offset = Math.max(0, highestDrawingColumn - highestDrawableIndex); // 오프셋을 계산하여 스크롤 위치 결정

        let validItems = results.filter((value) => (value.column - offset) >= 0); // 오프셋 이후의 항목만 유효함

        // 유효한 항목의 열 번호를 오프셋만큼 조정
        validItems.forEach((value) => value.column -= offset);

        return validItems; // 스크롤된 빅 로드 항목 리스트 반환
    }

    /**
     * 게임 번호에 따라 열 번호를 계산
     * @param {number} gameNumber 게임 번호
     * @param {number} columnSize 열당 행의 개수
     * @return {number} 열 번호
     */
    columnForGameNumber(gameNumber: number, columnSize: number): number {
        return Math.floor(gameNumber / columnSize); // 게임 번호를 열 크기로 나누어 열 번호 계산
    }

    /**
     * 게임 번호에 따라 행 번호를 계산
     * @param {number} gameNumber 게임 번호
     * @param {number} columnSize 열당 행의 개수
     * @return {number} 행 번호
     */
    rowForGameNumber(gameNumber: number, columnSize: number): number {
        return gameNumber % columnSize; // 게임 번호를 열 크기로 나눈 나머지로 행 번호 계산
    }
}

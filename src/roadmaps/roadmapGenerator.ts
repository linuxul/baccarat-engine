/* eslint-disable max-len */

const _ = require('lodash'); // lodash 모듈을 CommonJS 방식으로 가져옴
import { GameResult } from '../gameResult.js';

// BeadPlate 및 BeadPlateConfig의 타입 정의
interface BeadPlate {
    result: GameResult;
    column: number;
    row: number;
}

interface BeadPlateConfig {
    columns?: number;
    rows?: number;
}

// BigRoad 및 관련 타입 정의
interface BigRoadItem {
    result: GameResult;
    column: number;
    row: number;
    logicalColumn: number;
    ties: GameResult[];
}

interface BigRoadConfig {
    columns?: number;
    rows?: number;
    scroll?: boolean;
}

interface ColumnDictionary {
    logicalColumn: number;
    logicalColumnDepth: number;
    outcome: string;
}

/**
 * Generator for common baccarat roadmaps.
 */
export class RoadmapGenerator {

    /**
     * RoadmapGenerator
     * @constructor
     */
    constructor() {
    }

    /**
     * Calculates a bead plate based on games played.
     * @param {GameResult[]} gameResults The game results to calculate the roadmap from.
     * @param {BeadPlateConfig} config The configuration object for drawing options.
     * @return {BeadPlate[]} A data representation of how a bead plate can be drawn from this calculation.
     */
    beadPlate(gameResults: GameResult[] = [], { columns = 6, rows = 6 }: BeadPlateConfig): BeadPlate[] {
        const DisplayEntries = columns * rows;
        const ColumnSize = rows;

        // lodash의 takeRight 메서드를 사용해 gameResults의 최근 항목을 가져옵니다.
        gameResults = _.takeRight(gameResults, DisplayEntries);

        return _.range(0, gameResults.length).map((index) => ({
            result: gameResults[index] || ({} as GameResult),
            column: this.columnForGameNumber(index, ColumnSize),
            row: this.rowForGameNumber(index, ColumnSize),
        }));
    }

    /**
     * Calculates a big road based on games played.
     * @param {GameResult[]} gameResults The game results to calculate the roadmap from.
     * @param {BigRoadConfig} config The configuration object for drawing options.
     * @return {BigRoadItem[]} A data representation of how a big road can be drawn from this calculation.
     */
    bigRoad(gameResults: GameResult[] = [], { columns = 12, rows = 6, scroll = true }: BigRoadConfig = {}): BigRoadItem[] {
        let tieStack: GameResult[] = [];
        let placementMap: Record<string, BigRoadItem> = {};
        let logicalColumnNumber = 0;
        let lastItem: GameResult | undefined;
        let returnList: BigRoadItem[] = [];
        let maximumColumnReached = 0;

        gameResults.forEach((gameResult) => {
            if (gameResult.outcome === GameResult.Tie) {
                tieStack.push(gameResult);
            } else {
                if (lastItem) {
                    let lastItemInResults = _.last(returnList);
                    if (lastItem.outcome === GameResult.Tie) {
                        if (lastItemInResults) {
                            lastItemInResults.ties = _.cloneDeep(tieStack);
                            tieStack = [];
                            if (lastItemInResults.result.outcome !== gameResult.outcome) {
                                logicalColumnNumber++;
                            }
                        }
                    } else if (lastItem.outcome !== gameResult.outcome) {
                        logicalColumnNumber++;
                        tieStack = [];
                    } else {
                        tieStack = [];
                    }
                }

                let probeColumn = logicalColumnNumber;
                let probeRow = 0;
                let done = false;

                while (!done) {
                let keySearch = `${probeColumn}.${probeRow}`;
                let keySearchBelow = `${probeColumn}.${probeRow + 1}`;

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

                    done = true;
                } else if (probeRow + 1 >= rows) {
                    probeColumn++;
                } else if (!_.get(placementMap, keySearchBelow)) {
                    probeRow++;
                } else if (_.get(placementMap, keySearchBelow)?.result.outcome === gameResult.outcome) {
                    probeRow++;
                } else {
                    probeColumn++;
                }
            }

            maximumColumnReached = Math.max(maximumColumnReached, probeColumn);
        }

        lastItem = gameResult;
        });

        if (_.isEmpty(returnList) && tieStack.length > 0) {
            returnList.push({
                ties: _.cloneDeep(tieStack),
                column: 0,
                row: 0,
                logicalColumn: 0,
                result: {} as GameResult,
            });
        } else if (!_.isEmpty(returnList)) {
            _.last(returnList)!.ties = _.cloneDeep(tieStack);
        }

        if (scroll) {
            returnList = this.scrollBigRoad(returnList, maximumColumnReached, columns);
        }

        return returnList;
    }

    /**
     * Big road column definitions
     * @param {BigRoadItem[]} bigRoad The big road data
     * @return {Record<number, ColumnDictionary>} Map of columns
     */
    bigRoadColumnDefinitions(bigRoad: BigRoadItem[]): Record<number, ColumnDictionary> {
        let columnDictionary: Record<number, ColumnDictionary> = {};

        bigRoad.forEach((item) => {
            if (!_.has(columnDictionary, item.logicalColumn)) {
                columnDictionary[item.logicalColumn] = {
                    logicalColumn: item.logicalColumn,
                    logicalColumnDepth: 1,
                    outcome: item.result.outcome,
                };
            } else {
                columnDictionary[item.logicalColumn].logicalColumnDepth++;
            }
        });

        return columnDictionary;
    }

    /**
     * Derived road using the given cycle
     * @param {BigRoadItem[]} bigRoad The big road data
     * @param {number} cycleLength Cycle used to calculate the derived road
     * @return {string[]} A new list of derived road items
     */
    derivedRoad(bigRoad: BigRoadItem[], cycleLength: number): string[] {
        let columnDefinitions = this.bigRoadColumnDefinitions(bigRoad);
        let k = cycleLength;
        let outcomes: string[] = [];

        Object.values(columnDefinitions).forEach((bigRoadColumn) => {
        let outcome = 'blue';
        let n = bigRoadColumn.logicalColumn;

        for (let m = 0; m < bigRoadColumn.logicalColumnDepth; m++) {
            let rowMDepth = m + 1;

            if (rowMDepth >= 2) {
                let compareColumn = n - k;
                if (compareColumn <= 0) continue;

                let pColumn = columnDefinitions[compareColumn];
                if (!pColumn) continue;

                let p = pColumn.logicalColumnDepth;
                if (rowMDepth <= p) {
                    outcome = 'red';
                } else if (rowMDepth === p + 1) {
                    outcome = 'blue';
                } else if (rowMDepth > p + 1) {
                    outcome = 'red';
                }

                outcomes.push(outcome);
            } else {
            let kDistanceColumn = n - (k + 1);
            let leftColumn = n - 1;

            let kDistanceColumnDefinition = columnDefinitions[kDistanceColumn];
            let leftColumnDefinition = columnDefinitions[leftColumn];

            if (kDistanceColumnDefinition && leftColumnDefinition) {
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

        return outcomes;
    }

    bigEyeRoad(bigRoad: BigRoadItem[]): string[] {
        return this.derivedRoad(bigRoad, 1);
    }

    smallRoad(bigRoad: BigRoadItem[]): string[] {
        return this.derivedRoad(bigRoad, 2);
    }

    cockroachPig(bigRoad: BigRoadItem[]): string[] {
        return this.derivedRoad(bigRoad, 3);
    }

    scrollBigRoad(results: BigRoadItem[] = [], highestDrawingColumn: number, drawingColumns: number): BigRoadItem[] {
        const highestDrawableIndex = drawingColumns - 1;
        const offset = Math.max(0, highestDrawingColumn - highestDrawableIndex);

        let validItems = results.filter((value) => (value.column - offset) >= 0);

        validItems.forEach((value) => value.column -= offset);

        return validItems;
    }

    columnForGameNumber(gameNumber: number, columnSize: number): number {
        return Math.floor(gameNumber / columnSize);
    }

    rowForGameNumber(gameNumber: number, columnSize: number): number {
        return gameNumber % columnSize;
    }
}

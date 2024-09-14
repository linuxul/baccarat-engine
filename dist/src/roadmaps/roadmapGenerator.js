"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapGenerator = void 0;
const _ = require('lodash'); // lodash 모듈을 CommonJS 방식으로 가져옴
const gameResult_js_1 = require("../gameResult.js");
/**
 * Generator for common baccarat roadmaps.
 */
class RoadmapGenerator {
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
    beadPlate(gameResults = [], { columns = 6, rows = 6 }) {
        const DisplayEntries = columns * rows;
        const ColumnSize = rows;
        // lodash의 takeRight 메서드를 사용해 gameResults의 최근 항목을 가져옵니다.
        gameResults = _.takeRight(gameResults, DisplayEntries);
        return _.range(0, gameResults.length).map((index) => ({
            result: gameResults[index] || {},
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
    bigRoad(gameResults = [], { columns = 12, rows = 6, scroll = true } = {}) {
        let tieStack = [];
        let placementMap = {};
        let logicalColumnNumber = 0;
        let lastItem;
        let returnList = [];
        let maximumColumnReached = 0;
        gameResults.forEach((gameResult) => {
            var _a;
            if (gameResult.outcome === gameResult_js_1.GameResult.Tie) {
                tieStack.push(gameResult);
            }
            else {
                if (lastItem) {
                    let lastItemInResults = _.last(returnList);
                    if (lastItem.outcome === gameResult_js_1.GameResult.Tie) {
                        if (lastItemInResults) {
                            lastItemInResults.ties = _.cloneDeep(tieStack);
                            tieStack = [];
                            if (lastItemInResults.result.outcome !== gameResult.outcome) {
                                logicalColumnNumber++;
                            }
                        }
                    }
                    else if (lastItem.outcome !== gameResult.outcome) {
                        logicalColumnNumber++;
                        tieStack = [];
                    }
                    else {
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
                        let newEntry = {
                            row: probeRow,
                            column: probeColumn,
                            logicalColumn: logicalColumnNumber,
                            ties: _.cloneDeep(tieStack),
                            result: gameResult,
                        };
                        _.set(placementMap, keySearch, newEntry);
                        returnList.push(newEntry);
                        done = true;
                    }
                    else if (probeRow + 1 >= rows) {
                        probeColumn++;
                    }
                    else if (!_.get(placementMap, keySearchBelow)) {
                        probeRow++;
                    }
                    else if (((_a = _.get(placementMap, keySearchBelow)) === null || _a === void 0 ? void 0 : _a.result.outcome) === gameResult.outcome) {
                        probeRow++;
                    }
                    else {
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
                result: {},
            });
        }
        else if (!_.isEmpty(returnList)) {
            _.last(returnList).ties = _.cloneDeep(tieStack);
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
    bigRoadColumnDefinitions(bigRoad) {
        let columnDictionary = {};
        bigRoad.forEach((item) => {
            if (!_.has(columnDictionary, item.logicalColumn)) {
                columnDictionary[item.logicalColumn] = {
                    logicalColumn: item.logicalColumn,
                    logicalColumnDepth: 1,
                    outcome: item.result.outcome,
                };
            }
            else {
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
    derivedRoad(bigRoad, cycleLength) {
        let columnDefinitions = this.bigRoadColumnDefinitions(bigRoad);
        let k = cycleLength;
        let outcomes = [];
        Object.values(columnDefinitions).forEach((bigRoadColumn) => {
            let outcome = 'blue';
            let n = bigRoadColumn.logicalColumn;
            for (let m = 0; m < bigRoadColumn.logicalColumnDepth; m++) {
                let rowMDepth = m + 1;
                if (rowMDepth >= 2) {
                    let compareColumn = n - k;
                    if (compareColumn <= 0)
                        continue;
                    let pColumn = columnDefinitions[compareColumn];
                    if (!pColumn)
                        continue;
                    let p = pColumn.logicalColumnDepth;
                    if (rowMDepth <= p) {
                        outcome = 'red';
                    }
                    else if (rowMDepth === p + 1) {
                        outcome = 'blue';
                    }
                    else if (rowMDepth > p + 1) {
                        outcome = 'red';
                    }
                    outcomes.push(outcome);
                }
                else {
                    let kDistanceColumn = n - (k + 1);
                    let leftColumn = n - 1;
                    let kDistanceColumnDefinition = columnDefinitions[kDistanceColumn];
                    let leftColumnDefinition = columnDefinitions[leftColumn];
                    if (kDistanceColumnDefinition && leftColumnDefinition) {
                        if (kDistanceColumnDefinition.logicalColumnDepth === leftColumnDefinition.logicalColumnDepth) {
                            outcome = 'red';
                        }
                        else {
                            outcome = 'blue';
                        }
                        outcomes.push(outcome);
                    }
                }
            }
        });
        return outcomes;
    }
    bigEyeRoad(bigRoad) {
        return this.derivedRoad(bigRoad, 1);
    }
    smallRoad(bigRoad) {
        return this.derivedRoad(bigRoad, 2);
    }
    cockroachPig(bigRoad) {
        return this.derivedRoad(bigRoad, 3);
    }
    scrollBigRoad(results = [], highestDrawingColumn, drawingColumns) {
        const highestDrawableIndex = drawingColumns - 1;
        const offset = Math.max(0, highestDrawingColumn - highestDrawableIndex);
        let validItems = results.filter((value) => (value.column - offset) >= 0);
        validItems.forEach((value) => value.column -= offset);
        return validItems;
    }
    columnForGameNumber(gameNumber, columnSize) {
        return Math.floor(gameNumber / columnSize);
    }
    rowForGameNumber(gameNumber, columnSize) {
        return gameNumber % columnSize;
    }
}
exports.RoadmapGenerator = RoadmapGenerator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9hZG1hcEdlbmVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2FkbWFwcy9yb2FkbWFwR2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0QkFBNEI7OztBQUU1QixNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrQkFBK0I7QUFDNUQsb0RBQThDO0FBbUM5Qzs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBRXpCOzs7T0FHRztJQUNIO0lBQ0EsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBUyxDQUFDLGNBQTRCLEVBQUUsRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBbUI7UUFDaEYsTUFBTSxjQUFjLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztRQUN0QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFeEIsd0RBQXdEO1FBQ3hELFdBQVcsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUV2RCxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbEQsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSyxFQUFpQjtZQUNoRCxNQUFNLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7WUFDbkQsR0FBRyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO1NBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsT0FBTyxDQUFDLGNBQTRCLEVBQUUsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLENB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
/* eslint-disable max-len */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapGenerator = void 0;
const lodash_1 = require("lodash");
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
        gameResults = lodash_1.default.takeRight(gameResults, DisplayEntries);
        return lodash_1.default.range(0, gameResults.length)
            .map((index) => ({
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
                    let lastItemInResults = lodash_1.default.last(returnList);
                    if (lastItem.outcome === gameResult_js_1.GameResult.Tie) {
                        if (lastItemInResults) {
                            lastItemInResults.ties = lodash_1.default.cloneDeep(tieStack);
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
                    if (!lodash_1.default.get(placementMap, keySearch)) {
                        let newEntry = {
                            row: probeRow,
                            column: probeColumn,
                            logicalColumn: logicalColumnNumber,
                            ties: lodash_1.default.cloneDeep(tieStack),
                            result: gameResult,
                        };
                        lodash_1.default.set(placementMap, keySearch, newEntry);
                        returnList.push(newEntry);
                        done = true;
                    }
                    else if (probeRow + 1 >= rows) {
                        probeColumn++;
                    }
                    else if (!lodash_1.default.get(placementMap, keySearchBelow)) {
                        probeRow++;
                    }
                    else if (((_a = lodash_1.default.get(placementMap, keySearchBelow)) === null || _a === void 0 ? void 0 : _a.result.outcome) === gameResult.outcome) {
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
        if (lodash_1.default.isEmpty(returnList) && tieStack.length > 0) {
            returnList.push({
                ties: lodash_1.default.cloneDeep(tieStack),
                column: 0,
                row: 0,
                logicalColumn: 0,
                result: {},
            });
        }
        else if (!lodash_1.default.isEmpty(returnList)) {
            lodash_1.default.last(returnList).ties = lodash_1.default.cloneDeep(tieStack);
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
            if (!lodash_1.default.has(columnDictionary, item.logicalColumn)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9hZG1hcEdlbmVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb2FkbWFwcy9yb2FkbWFwR2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRCQUE0QjtBQUM1QixZQUFZLENBQUM7OztBQUViLG1DQUF1QjtBQUN2QixvREFBOEM7QUFtQzlDOztHQUVHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFFekI7OztPQUdHO0lBQ0g7SUFDQSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxTQUFTLENBQUMsY0FBNEIsRUFBRSxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFtQjtRQUNoRixNQUFNLGNBQWMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3RDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQztRQUV4QixXQUFXLEdBQUcsZ0JBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRXZELE9BQU8sZ0JBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUM7YUFDcEMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFnQjtZQUM5QyxNQUFNLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7WUFDbkQsR0FBRyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO1NBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsT0FBTyxDQUFDLGNBQTRCLEVBQUUsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsSUFBSSxLQUFvQixFQUFFO1FBQ2pHLElBQUks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
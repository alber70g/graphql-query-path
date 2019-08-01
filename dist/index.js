"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var picomatch = require("picomatch");
exports.getPathsFromAST = function (ast) {
    return ast.definitions.map(walkDefinitions);
};
var walkDefinitions = function (node) {
    if (node.kind === 'OperationDefinition') {
        return node.selectionSet.selections.reduce(createReduceSelections('/'), []);
    }
};
/**
 * @param pattern glob pattern to match the result against
 * @returns the matched entries in the array
 */
Array.prototype.contains = function (pattern) {
    var matcher = picomatch(pattern);
    return this.find(function (p) { return matcher(p); }) !== undefined;
};
exports.getPaths = function (info) {
    return info.operation.selectionSet.selections.reduce(createReduceSelections('/'), []);
};
var createReduceSelections = function (parent) { return function (acc, curr) {
    if (curr.kind === 'Field') {
        if (curr.selectionSet && curr.selectionSet.selections) {
            acc.push(parent + curr.name.value + '/');
            return curr.selectionSet.selections.reduce(createReduceSelections(parent + curr.name.value + '/'), acc);
        }
        else {
            acc.push(parent + curr.name.value);
            return acc;
        }
    }
    return acc;
}; };
//# sourceMappingURL=index.js.map
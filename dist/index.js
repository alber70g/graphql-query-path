"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaths = function (ast) {
    return ast.definitions.map(walkDefinitions);
};
var walkDefinitions = function (node) {
    if (node.kind === 'OperationDefinition') {
        return node.selectionSet.selections.reduce(createReduceSelections('/'), []);
    }
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
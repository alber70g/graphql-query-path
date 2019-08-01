"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathsFromAST = function (ast) {
    return ast.definitions.map(walkDefinitions);
};
var walkDefinitions = function (node) {
    if (node.kind === "OperationDefinition") {
        return node.selectionSet.selections.reduce(createReduceSelections("/"), []);
    }
};
// declare global {
//   interface Array<T> {
//     /**
//      * @param pattern glob pattern to match the result against
//      * @returns the matched entries in the array
//      */
//     contains(pattern: string): boolean;
//   }
// }
// /**
//  * @param pattern glob pattern to match the result against
//  * @returns the matched entries in the array
//  */
// Array.prototype.contains = function(pattern: string) {
//   const byPattern = (p: string) => picomatch(pattern)(p);
//   return this.find(byPattern) !== undefined;
// };
exports.getPaths = function (info) {
    return info.operation.selectionSet.selections.reduce(createReduceSelections("/"), []);
};
var createReduceSelections = function (parent) { return function (acc, curr) {
    if (curr.kind === "Field") {
        if (curr.selectionSet && curr.selectionSet.selections) {
            acc.push(parent + curr.name.value + "/");
            return curr.selectionSet.selections.reduce(createReduceSelections(parent + curr.name.value + "/"), acc);
        }
        else {
            acc.push(parent + curr.name.value);
            return acc;
        }
    }
    return acc;
}; };
//# sourceMappingURL=index.js.map
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var picomatch = require("picomatch");
__export(require("graphql-query-path"));
/**
 * @param pattern glob pattern to match the result against
 * @returns the matched entries in the array
 */
Array.prototype.contains = function (pattern) {
    var byPattern = function (p) { return picomatch(pattern)(p); };
    return this.find(byPattern) !== undefined;
};
//# sourceMappingURL=index.js.map
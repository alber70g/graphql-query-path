import * as picomatch from "picomatch";

export * from "graphql-query-path";

declare global {
  interface Array<T> {
    /**
     * @param pattern glob pattern to match the result against
     * @returns the matched entries in the array
     */
    contains(pattern: string): boolean;
  }
}

/**
 * @param pattern glob pattern to match the result against
 * @returns the matched entries in the array
 */
Array.prototype.contains = function(pattern: string) {
  const byPattern = (p: string) => picomatch(pattern)(p);
  return this.find(byPattern) !== undefined;
};

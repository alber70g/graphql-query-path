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

import { DocumentNode, GraphQLResolveInfo } from "graphql";
export declare const getPathsFromAST: (ast: DocumentNode) => (string[] | undefined)[];
declare global {
    interface Array<T> {
        /**
         * @param pattern glob pattern to match the result against
         * @returns the matched entries in the array
         */
        contains(pattern: string): boolean;
    }
}
export declare const getPaths: (info: GraphQLResolveInfo) => string[];

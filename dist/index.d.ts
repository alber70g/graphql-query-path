import { DocumentNode, GraphQLResolveInfo } from "graphql";
export declare const getPathsFromAST: (ast: DocumentNode) => (string[] | undefined)[];
export declare const getPaths: (info: GraphQLResolveInfo) => string[];

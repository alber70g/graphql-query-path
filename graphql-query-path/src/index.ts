import {
  DocumentNode,
  DefinitionNode,
  SelectionNode,
  GraphQLResolveInfo
} from "graphql";

export const getPathsFromAST = (ast: DocumentNode) => {
  return ast.definitions.map(walkDefinitions);
};

const walkDefinitions = (node: DefinitionNode) => {
  if (node.kind === "OperationDefinition") {
    return node.selectionSet.selections.reduce(createReduceSelections("/"), []);
  }
};

export const getPaths = (info: GraphQLResolveInfo) => {
  return info.operation.selectionSet.selections.reduce(
    createReduceSelections("/"),
    []
  );
};

const createReduceSelections = (parent: string) => (
  acc: string[],
  curr: SelectionNode
): string[] => {
  if (curr.kind === "Field") {
    if (curr.selectionSet && curr.selectionSet.selections) {
      acc.push(parent + curr.name.value + "/");
      return curr.selectionSet.selections.reduce(
        createReduceSelections(parent + curr.name.value + "/"),
        acc
      );
    } else {
      acc.push(parent + curr.name.value);
      return acc;
    }
  }
  return acc;
};

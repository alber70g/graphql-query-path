import {
  parse,
  DocumentNode,
  DefinitionNode,
  SelectionNode
} from "graphql";

export const getPaths = (ast: DocumentNode) => {
  return ast.definitions.map(walkDefinitions)
}

const walkDefinitions = (node: DefinitionNode) => {
  if (node.kind === "OperationDefinition") {
    return node.selectionSet.selections.reduce(
      createReduceSelections("/"),
      []
    );
  } else { 
    return [];
  }
}

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
      )
    } else {
      acc.push(parent + curr.name.value);
      return acc;
    }
  } 
  return [];
}

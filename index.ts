import {
  parse,
  DocumentNode,
  DefinitionNode,
  SelectionNode
} from "graphql";

const ast = parse(`query { user(id: 1) { name posts { title content } } }`);

/**
 * type Query {
 *  user: User
 * }
 * 
 * type User {
 *  name: String
 *  posts: [Post]
 * }
 * 
 * type Post {
 *  title: String
 *  content: String
 *  history: [Post]
 * }
 * 
 * N+1
 * 
 * /user/
 * /user/name
 * /user/posts/
 * /user/posts/title
 * /user/posts/content
 * 
 * 
 * resolver(parent, args, _, info) {
 *   
 *      db.usersWithPostsAndTags()
 *   }
 * }
 * 
 */

const getPaths = (ast: DocumentNode) => {
  return ast.definitions.map(walkDefinitions)
}

const walkDefinitions = (node: DefinitionNode) => {
  if (node.kind === "OperationDefinition") {
    return node.selectionSet.selections.reduce(
      createReduceSelections("/"),
      []
    );
  }
}

const createReduceSelections = (parent) => (
  acc: string[],
  curr: SelectionNode
) => {
  if (curr.kind === "Field") {
    if (curr.selectionSet && curr.selectionSet.selections) {
      acc.push(parent + curr.name.value + "/");
      return curr.selectionSet.selections.reduce(
        createReduceSelections(parent + curr.name.value + "/"),
        [...acc]
      )
    } else {
      acc.push(parent + curr.name.value);
      return acc;
    }
  }
}

const paths = getPaths(ast)

console.log(paths);

console.log(paths[0].find((p: string) => p.indexOf("user/posts") > -1));

// const resolver = () => {
//   if (paths[0].find((p: string) => p.indexOf("user/posts") > -1)) {
//     const query = db.getUsers().join('posts');
//     if (paths.contains('user/posts/history')) {
//       query.on('posts').join('history');
//     }
//   } else {
//     db.getUsers()
//   }
//   return query.execute();
// }

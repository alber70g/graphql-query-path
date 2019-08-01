import { getPathsFromAST, getPaths } from './index';
import { parse, graphql, buildSchema, GraphQLResolveInfo } from 'graphql';

test("root property doesn't contain trailing slash", () => {
  const paths = getPathsFromAST(parse('query { user }'));
  expect(paths[0]![0]).toBe('/user');
});

test('single query of one depth', () => {
  const ast = parse(`query { user { name } }`);
  const paths = getPathsFromAST(ast);

  expect(paths).toEqual([['/user/', '/user/name']]);
});

test('single query of two depth', () => {
  const ast = parse(`query { user { name posts { title content } } }`);
  const paths = getPathsFromAST(ast);

  expect(paths).toEqual([
    [
      '/user/',
      '/user/name',
      '/user/posts/',
      '/user/posts/title',
      '/user/posts/content',
    ],
  ]);
});

test('single query with arguments', () => {
  const ast = parse(`query { user(id: "1") { name } }`);
  const paths = getPathsFromAST(ast);

  expect(paths).toEqual([['/user/', '/user/name']]);
});

test('two queries', () => {
  const ast = parse(
    `query First { user(id: "1") { name } } 
    query Second { posts { title } }`,
  );
  const paths = getPathsFromAST(ast);

  expect(paths).toEqual([
    ['/user/', '/user/name'],
    ['/posts/', '/posts/title'],
  ]);
});

test('paths.contains with GraphQLResolveInfo single depth', async () => {
  const res = await graphql(
    buildSchema(
      `type Query {
        user: User
      }
      type User {
        name: String
        posts:[Post]
      }
      type Post {
        content: String
        title: String
      }`,
    ),
    `
      query {
        user {
          name
        }
      }
    `,
    {
      user(args: any, context: any, info: GraphQLResolveInfo) {
        const paths = getPaths(info);
        expect(paths).toEqual(['/user/', '/user/name']);
        expect(paths.contains('/user/posts/')).toEqual(false);
        expect(paths.contains('/user/**')).toBe(true);
        return {};
      },
    },
  );
  expect(res.errors).toBeUndefined();
});

test('paths.contains with GraphQLResolveInfo double depth', async () => {
  const res = await graphql(
    buildSchema(
      `type Query {
        user: User
      }
      type User {
        name: String
        posts:[Post]
      }
      type Post {
        content: String
        title: String
      }`,
    ),
    `
      query {
        user {
          name
          posts {
            title
          }
        }
      }
    `,
    {
      user(args: any, context: any, info: GraphQLResolveInfo) {
        const paths = getPaths(info);
        expect(paths).toEqual([
          '/user/',
          '/user/name',
          '/user/posts/',
          '/user/posts/title',
        ]);
        expect(paths.contains('/user/posts/')).toEqual(true);
      },
    },
  );
  expect(res.errors).toBeUndefined();
});

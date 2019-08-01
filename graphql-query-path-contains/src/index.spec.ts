import { getPaths } from './index';
import { parse, graphql, buildSchema, GraphQLResolveInfo } from 'graphql';

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
        return {};
      },
    },
  );
  expect(res.errors).toBeUndefined();
});

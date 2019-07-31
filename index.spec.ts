import { getPaths } from './index';
import { parse } from 'graphql';

test('getPaths exists', () => {
  getPaths(parse('query { name }'));
});

test('single query', () => {
  // const ast = parse(`query { user(id: 1) { name posts { title content } } }`);
  // const paths = getPaths(ast)
  // console.log(paths);
  // console.log(paths[0].find((p: string) => p.indexOf("user/posts") > -1));
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
});

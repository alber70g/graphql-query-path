# graphql-query-path

A library that allows you to smartly execute database queries by looking at the
field selection. This can mitigate the N+1 and even 1+1 problem of GraphQL
queries.

<!-- ![Version](https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000) [![Twitter: alber70g](https://img.shields.io/twitter/follow/alber70g.svg?style=social)](https://twitter.com/alber70g) -->

<p style="display: inline;">
    <a href="https://github.com/alber70g/graphql-query-path/graphs/contributors" alt="Contributors">
        <img src="https://img.shields.io/github/contributors/alber70g/graphql-query-path" /></a>
    <!-- <a href="#backers" alt="Backers on Open Collective">
        <img src="https://img.shields.io/opencollective/backers/graphql-query-path" /></a> -->
    <!-- <a href="#sponsors" alt="Sponsors on Open Collective">
        <img src="https://img.shields.io/opencollective/sponsors/graphql-query-path" /></a> -->
    <a href="https://github.com/alber70g/graphql-query-path/pulse" alt="Activity">
        <img src="https://img.shields.io/github/commit-activity/m/alber70g/graphql-query-path" /></a>
    <!-- <a href="https://circleci.com/gh/alber70g/graphql-query-path/tree/master">
        <img src="https://img.shields.io/circleci/project/github/alber70g/graphql-query-path/master" alt="build status"></a> -->
    <!-- <a href="https://circleci.com/gh/alber70g/daily-tests">
        <img src="https://img.shields.io/circleci/project/github/alber70g/daily-tests?label=service%20tests"
            alt="service-test status"></a> -->
    <!-- <a href="https://coveralls.io/github/alber70g/graphql-query-path">
        <img src="https://img.shields.io/coveralls/github/alber70g/graphql-query-path"
            alt="coverage"></a> -->
    <!-- <a href="https://lgtm.com/projects/g/alber70g/graphql-query-path/alerts/">
        <img src="https://img.shields.io/lgtm/alerts/g/alber70g/graphql-query-path"
            alt="Total alerts"/></a> -->
    <!-- <a href="https://github.com/alber70g/graphql-query-path/compare/gh-pages...master">
        <img src="https://img.shields.io/github/commits-since/alber70g/graphql-query-path/gh-pages?label=commits%20to%20be%20deployed"
            alt="commits to be deployed"></a> -->
    <a href="https://twitter.com/intent/follow?screen_name=graphql-query-path_io">
        <img src="https://img.shields.io/twitter/follow/alber70g?style=social&logo=twitter"
            alt="follow on Twitter"></a>
</p>

This repo contains two projects:

- **graphql-query-path** that has two functions: `getPaths` and
  `getPathsFromAST`. They return a list of paths reflecting the graphql-query
- **graphql-query-path-contains** the same as above and extends `Array` with
  `contains(glob: string): boolean` method that you can use to do glob matching.
  This one is ~17k bigger because of a dependency on `picomatch`.

## What is it

Given the following query

```graphql
query {
  user {
    name
    posts {
      title
      content
    }
  }
}
```

the `getPaths(info)` returns the following array

```js
[
  '/user',
  '/user/name',
  '/user/posts/',
  '/user/posts/title',
  '/user/posts/content',
];
```

This array can give the information you need to execute a querybuilder or call
other APIs in an efficient way.

## Usage

Install the package

```sh
npm i graphql-query-path
```

Use it in your graphql-resolver:

```js
import { getPaths } from 'graphql-query-paths';
// or
// const { getPaths } = require('graphql-query-paths');
const resolvers = {
  user(args, context, info) {
    // for example this query comes in
    // query: {
    //   user {
    //     name
    //     posts {
    //       title
    //       content
    //     }
    //   }
    // }
    const paths = getPaths(info);
    // paths: [
    //   '/user',
    //   '/user/name',
    //   '/user/posts/',
    //   '/user/posts/title',
    //   '/user/posts/content'
    // ]
    if (paths.find((p) => p.indexOf('/user/posts/') > -1)) {
      db.getUsersWithPosts();
    } else {
      db.getUsers();
    }
  },
};
```

Use the extended version to match glob pattern with `contains` from
`graphql-query-paths-contains`. This includes `picomatch` but increases the lib
size by ~17k.

```sh
npm i graphql-query-paths-contains
```

```js
import { getPaths } from 'graphql-query-paths-contains';
// or
// const { getPaths } = require('graphql-query-paths-contains');
const resolvers = {
  user(args, context, info) {
    if (getPaths(info).contains("/users/posts/"))) {
      db.getUsersWithPosts();
    } else {
      db.getUsers();
    }
  },
};
```

## Interface docs

Library **graphql-query-paths**

| function/argument                     | type                                                                                | description                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **getPathsFromAST(ast)**              | `string[][]`                                                                        | Returns a list of subqueries with paths reflected in the sub query per subquery |
| <span style="align: right">ast</span> | `DocumentNode` [link](https://graphql.org/graphql-js/language/#parse)               | The DocumentNode from `import { parse } from 'graphql'`                         |
| **getPaths(info)**                    | `string[]`                                                                          | Returns a list of paths reflected in the query                                  |
| info                                  | `GraphQLResolveInfo` [link](https://graphql.org/graphql-js/type/#graphqlobjecttype) | The last argument in a resolver                                                 |

Library **graphql-query-paths-contains** extends the library above with a
`contains` function

| function/argument                  | type      | description                                                                                                                                               |
| ---------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Array.prototype.contains(glob)** | `boolean` | Extends Array with `contains` function. To know if a result contains a path you can execute `getPaths(info).contains("/user/**")`. This returns a boolean |
| glob                               | `string`  | a string representing a glob to filter the array with                                                                                                     |

## Potential features

- [ ] Create a `pathContains(info, pattern)` function that can lazily find
      instead of extracting all paths firsts

## Author

**Albert Groothedde**

- Twitter: [@alber70g](https://twitter.com/alber70g)
- Github: [@alber70g](https://github.com/alber70g)

## Contributing

Contributions, issues and feature requests are welcome!

Feel free to check
[issues page](https://github.com/alber70g/graphql-query-path/issues).

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated by
[readme-md-generator](https://github.com/kefranabg/readme-md-generator)_

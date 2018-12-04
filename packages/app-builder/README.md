# @sketchmine/app-builder

> Important: [Dynatrace](https://www.dynatrace.com/) internal tool. May not fit your needs.

The app builder generates the examples application.

- [@sketchmine/app-builder](#sketchmineapp-builder)
  - [Dependency graph](#dependency-graph)
  - [Building the package](#building-the-package)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)

## Dependency graph

![Dependency graph of the sketchmine app-builder](https://dt-cdn.net/images/app-builder-3920-26893ebb1b.png)

## Building the package

For building the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.
The package bundle is in the **commonjs** format and meant to be consumed only be node.js applications.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package. *(rebuilds after safe)*

## Linting

The source code of this package is going to be linted by our CI environment. To ensure a coding standard and quality use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

run `yarn lint` to execute the linter.

## Testing the package

To ensure that the app-builder is working, write tests and put them in proper named file.

**Important!**

All tests according to this package should be wrapped in a describe with the prefix: `[app-builder] › ...` like the following:

```typescript
// import statements

describe('[app-builder] › ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> For tests the **jest** Framework was chosen, see [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to run all tests specified for the app builder. Run `yarn test -f filename.test` to run only tests that matches the provided RegExp for the filename.

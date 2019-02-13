![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/helpers

This package is a collection of platform independent helpers that have to work in the browser and on [Node.js](https://nodejs.org/en/).

- [@sketchmine/helpers](#sketchminehelpers)
  - [Dependency graph](#dependency-graph)
  - [List of helpers](#list-of-helpers)
  - [Building the package](#building-the-package)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)

## Dependency graph

![Dependency graph of the sketchmine helpers](https://dt-cdn.net/images/helpers-3920-bdf2b6b640.png)

## List of helpers

- **[asyncForEach](./src/async-for-each.ts)** await able forEach loop.
- **[capitalizeFirstLetter](./src/capitalize-first-letter.ts)** Capitalizes the first letter of a word.
- **[kebabCaseToCamelCase](./src/kebab-case-to-camel-case.ts)** Converts kebab-case-words to camelCase
- **[rgbToHex](./src/rgb-to-hex.ts)** converts rgb color to HEX.
- **[StyleDeclaration](./src/style-declaration.ts)** Subset Class of the CSSStyleDeclaration with Browser default values.
- **[UUID](./src/uuid.ts)** Fast UUID generator, RFC4122 version 4 compliant.

## Building the package

For building the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.
The package bundle is in the **commonjs** format and meant to be consumed only be node.js applications.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package. *(rebuilds after safe)*

## Linting

The source code of this package is going to be linted by our CI environment. To ensure a coding standard and quality use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

Run `yarn lint` to execute the linter.

## Testing the package

To ensure that the helpers are working, write tests and put them in a proper named file.

**Note**: All tests according to this package should be wrapped in a `describe` with the prefix: `[helpers] › ...` like the following:

```typescript
// import statements

describe('[helpers] › ${description of the functionality that should be tested}', () => {
  // your tests should be placed here
});
```

> For tests the Jest Framework was selected. See [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to run all tests specified for the helpers. Run `yarn test -f filename.test` to run only tests that matches the provided RegExp for the filename.

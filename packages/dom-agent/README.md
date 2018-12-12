![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/dom-agent

The DOM agent is at the heart of the entire library. This package takes responsibility for scraping the style information from a Webpage and outputing an abstract format with the DOM representation and the styling. Based on this information, **[sketch-builder](../sketch-builder)** can be used to later draw the Sketch file.

- [@sketchmine/dom-agent](#sketchminedom-agent)
  - [Dependency graph](#dependency-graph)
    - [About](#about)
  - [Building the package](#building-the-package)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)

## Dependency graph

![Dependency graph of the sketchmine dom-agent](https://dt-cdn.net/images/dom-agent-3920-83c372adee.png)

### About

The DOM agent consists of three parts:

- **[dom traverser](./src/dom-traverser.ts)** Traverses the Dom nodes recursively and applies the visitor on each node.
- **[dom visitor](./src/dom-visitor.ts)** Visits a DOM Node and extracts the style-information.
- **[public-api](./src/public-api.ts)** Provides only typings for non browser specific code.

## Building the package

For building the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.
The package bundle is in the **ecmascript module** format and is meant to be consumed only by the browser.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package. *(rebuilds after safe)*

## Linting

The source code of this package is going to be linted by our CI environment. To ensure a coding standard and quality, use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

Run `yarn lint` to execute the linter.

## Testing the package

To ensure that the DOM agent is properly working, it's necessary that you write tests.
There are two types of tests:

- Unit tests for testing functionality
- End-to-end tests for testing the DOM agent in a headless Chrome browser.

End to end tests have to end with `filename.e2e.ts` and unit tests with `filename.test.ts`.

For the end to end tests, [Puppeteer](https://github.com/GoogleChrome/puppeteer) is used as a headless Chrome browser.

**Note**: All tests based on this package should be wrapped in a `describe` method with the prefix: `[dom-agent] › ...` like the following:

```typescript
// import statements

describe('[dom-agent]› ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> The [Jest framework](https://jestjs.io/) has been selected for tests.

Run `yarn test` to run all tests specified for this package. Run `yarn test -f filename.test` to run only tests that matches the provided RegExp for the filename.

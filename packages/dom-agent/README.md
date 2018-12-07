![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/dom-agent

The Dom Agent is a heart piece of the whole library. This package takes responsibility to scrape the Style information from a Webpage and output an abstract format with the DOM representation and the styling. According to this information later on the **[sketch-builder](../sketch-builder)** can be used to draw the Sketch file.

- [@sketchmine/dom-agent](#sketchminedom-agent)
  - [Dependency graph](#dependency-graph)
    - [About](#about)
  - [Building the package](#building-the-package)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)

## Dependency graph

![Dependency graph of the sketchmine dom-agent](https://dt-cdn.net/images/dom-agent-3920-83c372adee.png)

### About

The dom agent consists out of three parts:

- **[dom traverser](./src/dom-traverser.ts)** Traverses the Dom nodes recursively and applies the visitor on each node.
- **[dom visitor](./src/dom-visitor.ts)** Visits a DOM Node and extracts the style-information.
- **[public-api](./src/public-api.ts)** Provides only typings for non browser specific code.

## Building the package

For building the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.
The package bundle is in the **ecmascript module** format and meant to be consumed only by the browser.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package. *(rebuilds after safe)*

## Linting

The source code of this package is going to be linted by our CI environment. To ensure a coding standard and quality use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

run `yarn lint` to execute the linter.

## Testing the package

To ensure that the dom-agent is properly working, writing tests is necessary!
There are two types of tests:

- Unit tests for testing functionality
- End to end tests for testing the dom-agent in a headless chrome.

End2End tests have to end with `filename.e2e.ts` and unit tests with `filename.test.ts`.

For the end 2 end tests [Puppeteer](https://github.com/GoogleChrome/puppeteer) is used as a headless chrome.

**Important!**

All tests according to this package should be wrapped in a describe with the prefix: `[dom-agent] › ...` like the following:

```typescript
// import statements

describe('[dom-agent]› ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> For tests the **jest** Framework was chosen, see [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to run all tests specified for this package. Run `yarn test -f filename.test` to run only tests that matches the provided RegExp for the filename.

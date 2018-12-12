![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/app-builder

> **Note**: This is a [Dynatrace](https://www.dynatrace.com/) internal tool that may not fit your needs.

The app-builder builds the example Angular application out of our »pure example components« to generate the Dynatrace components library.

- [@sketchmine/app-builder](#sketchmineapp-builder)
  - [Dependency graph](#dependency-graph)
  - [The purpose](#the-purpose)
  - [Building the package](#building-the-package)
    - [Prerequisites](#prerequisites)
    - [how to build](#how-to-build)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)

## Dependency graph

![Dependency graph of the Sketchmine app-builder](https://dt-cdn.net/images/app-builder-3920-26893ebb1b.png)

## The purpose

As a brief overview of this package, please note that this package doesn't make any sense as a standalone package, even if it's possible to execute it from the command line and the integrated CLI. This package is orchestrated from the **@sketchmine/library**. It's responsible for generating an Angular application that instances all the library components, so that the **@sketchmine/dom-agent** can scrape the meta information related to styling and pass it to the **@sketchmine/sketch-builder**, which generates a new library Sketch file.

## Building the package

### Prerequisites

This package has a `postinstall` task defined in the NPM scripts that takes responsibility to move the app shell to the destination where it can be modified. The default path is defined in the `config.sample.json`.

> You must create the `config.json` before you run the `yarn install` task.

To work properly, the `./config.sample.json` must be adapted to the correct paths. If you need help, the CLI will provide you with feedback about the available options.
You will see the CLI help page if the executeable (`./lib/bin.js`) is executed without any arguments.

If you already know how to configure the `config.json`, you can execute the builder with `node lib/bin -c config.json` or if you need it in your library process, the main entry point can be imported like `import { main } from '@sketchmine/app-builder';`.

### How to build

To build the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` and is orchestrated by the [Yarn package manager](https://yarnpkg.com/en/).
The package bundle is in the **commonjs** format and is meant to be consumed only by Node.js applications.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package. <!-- what does this mean: "(rebuilds after safe)" -->

## Linting

The source code of this package will be linted by our CI environment. To ensure a coding standard and quality, use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

Run `yarn lint` to execute the linter.

## Testing the package

To ensure that the app-builder is working, write tests and put them in a properly named file.

**Note**: All tests based on this package should be wrapped in a `describe` method with the prefix: `[app-builder] › ...` as shown in the following:

```typescript
// import statements

describe('[app-builder] › ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> For tests the **Jest** framework has been seleted. See [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to run all tests specified for the app builder. Run `yarn test -f filename.test` to run only tests that match the provided RegExp for the filename.

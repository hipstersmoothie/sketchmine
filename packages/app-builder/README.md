![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/app-builder

> Important: [Dynatrace](https://www.dynatrace.com/) internal tool. May not fit your needs.

The app-builder builds the example angular application out of our »pure example components« to generate the dynatrace components library.

- [@sketchmine/app-builder](#sketchmineapp-builder)
  - [Dependency graph](#dependency-graph)
  - [The purpose](#the-purpose)
  - [Building the package](#building-the-package)
    - [Prerequisites](#prerequisites)
    - [how to build](#how-to-build)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)

## Dependency graph

![Dependency graph of the sketchmine app-builder](https://dt-cdn.net/images/app-builder-3920-26893ebb1b.png)

## The purpose

To give you a brief overview of this package it is necessary to know that this package does not make any sense as standalone package, even if it is possible to execute it from the command line and the integrated cli. This package gets orchestrated from the **@sketchmine/library**. It is responsible to generate an Angular Application that instances all the library components, so that the **@sketchmine/dom-agent** can scrape the meta information about the styling and can pass it to the **@sketchmine/sketch-builder**, that generates a new library Sketch file.

## Building the package

### Prerequisites

This package has a `postinstall` task defined in the npm scripts that takes responsibility to move the app shell to the destination where it can be modified. The default path is defined in the `config.sample.json`.

> So you have to create the `config.json` before you run the `yarn install` task.

To work properly the `./config.sample.json` has to be adapted to the correct paths. If you need help, the CLI will provide you with feedback about the available options.
You will see the CLI help page if the executeable (`./lib/bin.js`) is executed without any arguments.

If you already know how to configure the `config.json`, you can execute the builder with `node lib/bin -c config.json` or if you need it in your library process, the main entry
point can be imported like `import { main } from '@sketchmine/app-builder';`.

### how to build

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

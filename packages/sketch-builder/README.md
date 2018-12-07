![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/sketch-builder

The sketch-builder is the heart piece of this library. It takes control over generating **.sketch** files from any html that is provided to the library. It can draw a symbol Library or just any plain web page. The orchestration for drawing the whole library is done by the **@sketchmine/library** itself.

- [@sketchmine/sketch-builder](#sketchminesketch-builder)
  - [Dependency graph](#dependency-graph)
  - [The CLI](#the-cli)
    - [CLI options](#cli-options)
      - [Drawing a page](#drawing-a-page)
      - [Drawing a symbol library](#drawing-a-symbol-library)
  - [How to develop](#how-to-develop)
    - [How to build](#how-to-build)
    - [Running the package](#running-the-package)
    - [Debugging](#debugging)
      - [Available debug spaces for granular logging:](#available-debug-spaces-for-granular-logging)
    - [Linting](#linting)
    - [Testing the package](#testing-the-package)

## Dependency graph

![Dependency graph of the sketchmine sketch-builder](https://dt-cdn.net/images/sketch-builder-3920-3cec01ab5f.png)

## The CLI

The package can be consumed in two ways, First of all it can be executed via the CLI *(command line interface)*. You have to install the package with yarn or npm from `@sketchmine/sketch-builder` and then you can go ahead with `npx skm-sketch-builder -c ...` Therefore you have to provide at least one option:

### CLI options

| flag | description |
|---|---|
| -h, --help | displays the help page 📓 |
| -c, --config | path to the configuration file `./config.json` |

The `config.json` can have two different configurations.

1. Drawing any other page
2. Drawing the Symbols Library

#### Drawing a page

The first option is to configure it to draw any webpage. A sample configuration for that is provided in the [`config.smaple-page.json`](./config.sample-page.json).

The pages array is for the possibility to draw multiple pages. if only the root page should be drawn pass an empty string or a `/`.

If the property `"metaInformation": "path/to/meta.json"` with the path to the meta information, that is generated with the **@sketchmine/code-analyzer**, is set that holds all symbols the symbol detection can be processed.

#### Drawing a symbol library

To draw a library with symbols you need to implement an api that listens to the events that are described in the [builder-api](./src/builder-api). The sample configuration for that is provided under [`config.smaple-library.json`](./config.sample-library.json).

In our environment the property `library` points to an angular app that is served under `http://localhost:4200`. This application is built by the **@sketchmine/app-builder**. There you can see a sample implementation of the API-communication that provides the sketch builder with the information when to draw, or which user interaction should be triggered like clicking on an element to open a dialog that should be drawn as Sketch symbol.

Furthermore the `rootElement` should be changed to get the first root element of the application.

Last but not least the type information for the configuration is located under [sketch-builder.d.ts](./src/sketch-builder.d.ts).

## How to develop

You need to adjust the `config.json` up to your needs like described in the section before.
After a `yarn install` was performed you can go ahead building it.

### How to build

To build the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` file and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.
The package bundle is formatted **commonjs** and is meant to be consumed only by node.js applications.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package *(rebuilds after safe)*.

### Running the package

The package can be executed with node like `node lib/bin.js`. If you need to orchestrate the builder in the script you can import it and provide the config to the main function as Object.

### Debugging

For debugging, you can specify specific debug spaces with `DEBUG=${space1},${space2},${space3}... node lib/bin` or just set `DEBUG` to `true`.

If you want to speed up the sketch-builder you can skip the headless chrome part and use a static json file from the fixtures.
The fixture file is located under `/tests/fixtures/library.json`.

If you pass the Node environment `TRAVERSER=skip-traverser node ...` to the node command the fixture file is used.

#### Available debug spaces for granular logging:

* debug *general information about all the drawn symbols with measurements*
* dom-traverser *Result of the DOM Traverser*

### Linting

The source code of this package is going to be linted by our CI environment. To ensure a coding standard and quality use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

Run `yarn lint` to execute the linter.

### Testing the package

To ensure that the sketch-builder is working, write tests and put them in proper named file.

**Important!**

All tests according to this package should be wrapped in a describe with the prefix: `[sketch-builder] › ...` like the following:

```typescript
// import statements

describe('[sketch-builder] › ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> For tests the **jest** Framework was chosen, see [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to execute all tests specified for the sketch-builder. Run `yarn test -f filename.test` to execute only tests that match the provided RegExp for the filename.

![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/app-builder

> **Note**: This is a [Dynatrace](https://www.dynatrace.com/) internal tool that may not fit your needs.

The app-builder builds the example Angular application out of our »pure example components« to generate the dynatrace components library. We've added support for [Angular Material](https://material.angular.io) as well but keep in mind that it is optimized for the dynatrace components library.

We are using the [Angular devkit Schematics](https://material.angular.io/guide/schematics) for generating the app-shell.

- [@sketchmine/app-builder](#sketchmineapp-builder)
  - [Dependency graph](#dependency-graph)
  - [The purpose](#the-purpose)
  - [Building the package](#building-the-package)
    - [Get running with material2](#get-running-with-material2)
      - [Prerequisites](#prerequisites)
      - [Build the application](#build-the-application)
      - [Run the application](#run-the-application)
    - [How to build](#how-to-build)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)

## Dependency graph

![Dependency graph of the Sketchmine app-builder](https://dt-cdn.net/images/app-builder-3920-26893ebb1b.png)

## The purpose

As a brief overview of this package, please note that this package doesn't make any sense as a standalone package, even if it's possible to execute it from the command line and the integrated CLI. This package is orchestrated from the **@sketchmine/library**. It's responsible for generating an Angular application that instances all the library components, so that the **@sketchmine/dom-agent** can scrape the meta information related to styling and pass it to the **@sketchmine/sketch-builder**, which generates a new library Sketch file.

## Building the package

### Get running with material2

#### Prerequisites
To get started it is necessary to checkout the material2 github repository in a separate folder. Then checkout a specific version with `git checkout 7.1.1` for example.

After that perform a `npm install` and generate the examples module file with `npx gulp build-examples-module`. Now everything should be ready to go ahead.

Now it is time to generate the meta information from the library for that use the **@sketchmine/code-analyzer** – see further information about how to generate this information in the [README.md from the code-analyzer](../code-analyzer/README.md). Come back if the meta information was generated.

Now it is time to prepare the configuration. Therefore you will find the `config.material.json` in the package root. Please update the paths to the `src/material-examples/` folders and the path to the meta-information.json file.

After that you can map which library component like (button, card, grid-list) should match which examples Component in the examples folder. *Notice that it is important to lock the version of `@angular/material` to the same that was checked out with git!*

#### Build the application

Now it is time to execute the schematics that will build the examples-library.
Please run `yarn build` to build the [angular schematics](https://material.angular.io/guide/schematics) that are written in TypeScript. After you have built them perform the `yarn schematics --dryRun=false --config=config.material.json` command where you provide the configuration to the schematics.

After this a folder according to the `directory` property in the `config.material.json` is generated with your app shell.

#### Run the application

The last step before running the application is to copy the generated **meta-information** to the needed destination. For this a gulp task is prepared for you. Execute `npx gulp copyMeta` and after this you can go ahead!

This is mostly done by the **@sketchmine/library** but you can navigate in the generated directory and execute `ng serve`. If you want to build the library with the sketch-builder by hand.

### How to build

For building the package [Gulp](https://gulpjs.com/) is used in combination with the `tsc`. The configuration can be found in the `gulpfile.js` and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.

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

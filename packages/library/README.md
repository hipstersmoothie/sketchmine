![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

The library package is the orchestrator and conductor of some parts of the library.
Think of it as the main shaft in a mine where the mine car has to deliver diamonds from the furthest tunnel through the shaft and up to the entrance.

# @sketchmine/library

- [@sketchmine/library](#sketchminelibrary)
  - [Dependency graph](#dependency-graph)
  - [Want to Contribute?](#want-to-contribute)
    - [building the package](#building-the-package)
    - [linting](#linting)
    - [testing](#testing)

## Dependency graph

![Dependency graph of the sketchmine library generation](https://dt-cdn.net/images/library-3920-8b693db8f2.png)

## Want to contribute?

We would be glad if you find a bug or a missing feature and contribute your solution.
To archive that some things are necessary to know.

### Building the package

For building the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.
The package bundle is in the **commonjs** format and meant to be consumed only be node.js applications.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package. *(rebuilds after safe)*

### Linting

The source code of this package is going to be linted by our CI environment. To ensure a coding standard and quality use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

Run `yarn lint` to execute the linter.

### testing

Sorry but currently there are no tests specified. 😭
Feel free to add some! 💪🏻

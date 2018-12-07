![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/sketch-color-replacer

The sketch-color-replacer is a CLI tool to replace a set of legacy colors with new colors.
We had the need @Dynatrace to replace over 80 colors, over multiple files with the new brand colors.

- [@sketchmine/sketch-color-replacer](#sketchminesketch-color-replacer)
  - [Dependency graph](#dependency-graph)
  - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Run the replacer](#run-the-replacer)
  - [Want to Contribute?](#want-to-contribute)
    - [building the package](#building-the-package)
    - [linting](#linting)
    - [testing](#testing)

## Dependency graph

![Dependency graph of the sketchmine sketch-color-replacer](https://dt-cdn.net/images/sketch-color-replacer-3920-0a2d6ceb84.png)

## Prerequisites

The color-replacer needs a `./colors-json` file provided with the colors that need to be replaced and of course a .sketch file where the replacement should be applied.

The **colors.json** file follows following convention:

```json
{
  "legacycolor": "newcolor",
  "#AJ54K0": "#333333",
  ...
}
```

### Installation

Installing the package can be performed with yarn or npm. `yarn add @sketchmine/sketch-color-replacer` will add the **executable** and the **typings** to your node_modules folder.

## Run the replacer

To execute the colors replacer you can go ahead with the .bin like `npx skm-color-replacer --colors /path/to/colors.json --file /path/to/file.sketch`.

## Want to Contribute?

We would be glad if you find a bug or a missing feature and contribute your solution.
To archive that some things are necessary to know.

### building the package

For building the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.
The package bundle is in the **commonjs** format and meant to be consumed only be node.js applications.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package. *(rebuilds after safe)*

### linting

The source code of this package is going to be linted by our CI environment. To ensure a coding standard and quality use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

run `yarn lint` to execute the linter.

### testing

Sorry but currently there are no tests specified. 😭
Feel free to add some! 💪🏻

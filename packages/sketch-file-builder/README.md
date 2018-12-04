# @sketchmine/sketch-file-builder

This package provides a [Node.js](https://nodejs.org/en/) layer of creating .sketch files with the open file format. You have to Provide an array of Pages *(Sketch JSON objects)* that should be written in the file. Furthermore this package takes care of creating all the boilerplate files and folder structures inside a Sketch file.

- [@sketchmine/sketch-file-builder](#sketchminesketch-file-builder)
  - [Dependency graph](#dependency-graph)
  - [Building the package](#building-the-package)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)
  - [Useful bash scripts](#useful-bash-scripts)
    - [convert a folder to a .sketch file](#convert-a-folder-to-a-sketch-file)
    - [convert .sketch file to folder:](#convert-sketch-file-to-folder)

## Dependency graph

![Dependency graph of the sketchmine sketch-file-builder](https://dt-cdn.net/images/sketch-file-builder-3920-aaa3e21a95.png)

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

To ensure that the sketch-file-builder is working, write tests and put them in proper named file.

**Important!**

All tests according to this package should be wrapped in a describe with the prefix: `[sketch-file-builder] › ...` like the following:

```typescript
// import statements

describe('[sketch-file-builder] › ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> For tests the **jest** Framework was chosen, see [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to run all tests specified for the Sketch file builder. Run `yarn test -f filename.test` to run only tests that matches the provided RegExp for the filename.

## Useful bash scripts

Bash scripts for working with the Sketch open file format:

### convert a folder to a .sketch file

``` bash
declare filename=dt-asset-lib
# rm -rf ${filename}.sketch
cd ${filename}
zip -r -X ../${filename}.zip *
cd ..
mv ${filename}.zip ${filename}.sketch
rm -rf ${filename}.zip
open ${filename}.sketch

```

### convert .sketch file to folder:

``` bash
declare filename=dt-asset-lib
# rm -rf ${filename}.sketch
# cp ./${filename}.bak.sketch ${filename}.sketch
mv ${filename}.sketch ${filename}.zip
unzip ${filename}.zip -d ./${filename}
rm -rf ${filename}.zip
```

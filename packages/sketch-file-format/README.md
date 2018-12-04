# @sketchmine/sketch-file-format

The sketch file format provides a platform independent layer above the Sketch File formats JSON structure.
To see the JSON output without unzipping or modifying the .sketch file sketch provides a tool called [SketchTool](https://developer.sketchapp.com/guides/sketchtool/) that is shipped with Sketch.

To receive a dump of the JSON structure that is going to be built with this package you can use the following command: `sketchtool dump path/to/document.sketch`

- [@sketchmine/sketch-file-format](#sketchminesketch-file-format)
  - [Dependency graph](#dependency-graph)
  - [Architecture](#architecture)
    - [Interfaces](#interfaces)
    - [Object Types](#object-types)
    - [Models](#models)
  - [Building the package](#building-the-package)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)

## Dependency graph

![Dependency graph of the sketchmine sketch-file-format](https://dt-cdn.net/images/sketch-file-format-3920-4722dc1df2.png)

## Architecture

### Interfaces

The most helpful area in this package will be the `./src/interfaces` folder that provides all interfaces for the Sketch file format. Everything that is a Sketch related interface should be prefixed with `interface Sketch${object-name} {}` like `interface SketchBase {}`.

> Be aware that this collection of interfaces was reverse engineered, in case there is no official documentation for that.

To get a clue what all the **magic numbers** in sketch are take a look at the [sketch-constants.ts](./src/helpers/sketch-constants.ts) file that provides all the enums with human understandable values.

### Object Types

Sketch Object types are the `_class` properties in the JSON tree of a Sketch file.

All available Object Types that are reverse engineered are listed in an enum in the `base.interface.ts`.
If you add a new model for a new Sketch object please be sure to add it to the ObjectTypes enum as well.

```typescript
export enum SketchObjectTypes {
  Artboard = 'artboard',
  AttributedString = 'attributedString',
  Bitmap = 'bitmap',
  Blur = 'blur',
  Border = 'border',
  Color = 'color',
  CurvePoint = 'curvePoint',
  Document = 'document',
  ExportOptions = 'exportOptions',
  Fill = 'fill',
  FontDescriptor = 'fontDescriptor',
  Frame = 'rect',
  Gradient = 'gradient',
  GradientStop = 'gradientStop',
  GraphicsContext = 'graphicsContextSettings',
  Group = 'group',
  InnerShadow = 'innerShadow',
  OverrideValue = 'overrideValue',
  Page = 'page',
  ParagraphStyle = 'paragraphStyle',
  Path = 'path',
  Rectangle = 'rectangle',
  RulerData = 'rulerData',
  Shadow = 'shadow',
  ShapeGroup = 'shapeGroup',
  ShapePath = 'shapePath',
  StringAttribute = 'stringAttribute',
  Style = 'style',
  SymbolInstance = 'symbolInstance',
  SymbolMaster = 'symbolMaster',
  Text = 'text',
  TextStyle = 'textStyle',
}
```

### Models

The models are the abstract syntax tree of the Sketch file format. You can build the Object Tree of the Sketch file in Typescript classes.

Every Sketch Object should has his own models file. *(Try to avoid code duplication – for this purpose there is a base model where the class can extend from)*

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

To ensure that the sketch-file-format is working, write tests and put them in proper named file.

**Important!**

All tests according to this package should be wrapped in a describe with the prefix: `[sketch-file-format] › ...` like the following:

```typescript
// import statements

describe('[sketch-file-format] › ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> For tests the **jest** Framework was chosen, see [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to run all tests specified for the Sketch file format. Run `yarn test -f filename.test` to run only tests that matches the provided RegExp for the filename.

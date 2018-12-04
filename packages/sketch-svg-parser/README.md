# @sketchmine/sketch-svg-parser

- [@sketchmine/sketch-svg-parser](#sketchminesketch-svg-parser)
  - [Dependency graph](#dependency-graph)
  - [The SVG parser](#the-svg-parser)
  - [Building the package](#building-the-package)
  - [Linting](#linting)
  - [Testing the package](#testing-the-package)

The sketch-svg-parser is used to get an SVG image and convert it to [Curve Points](https://sketchapp.com/docs/vector-editing/points-and-paths).
SVG Images consist of Curve definitions. As the SVG syntax for paths differs from the Sketch syntax, this package handles the conversion between them.

## Dependency graph

![Dependency graph of the sketchmine sketch-svg-parser](https://dt-cdn.net/images/sketch-svg-parser-3920-8bde931eda.png)

## The SVG parser

The `src/svg-parser.ts` is the entry point to this package that receives the input of the SVG as string and the width and the height of the provided SVG.

The width and the height can be received in a browser through the `$0.getBoundingClientRect()` that provides a DOMRect with the actual width and height of the SVG Element.

```typescript
export class SvgParser {
  static parse(svg: string, width: number, height: number): ISvg { }
  ...
}
```

In a library context, the *sketch-svg-parser* gets called by the *sketch-builder* in the `element-drawer.ts` with the following code.

First of all, the **SvgParser** parses the SVGElement and then the object gets converted by the **SvgToSketch** class that returns the Sketch-AST of an SVG Element.

```typescript
// the function that calls the SvgParser
private generateSVG(element: ITraversedDomSvgNode) {
  const size = this.getSize(element);
  const svgObject = SvgParser.parse(element.html, size.width, size.height);

  const svg = new SvgToSketch(svgObject, size);
  svg.styles = element.styles;

  this.layers.push(...svg.generateObject());
}
```

## Building the package

To build the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` file and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.
The package bundle is formatted **commonjs** and is meant to be consumed only by node.js applications.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package *(rebuilds after safe)*.

## Linting

The source code of this package is going to be linted by our CI environment. To ensure a coding standard and quality use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

Run `yarn lint` to execute the linter.

## Testing the package

To ensure that the sketch-svg-parser is working, write tests and put them in proper named file.

**Important!**

All tests according to this package should be wrapped in a describe with the prefix: `[sketch-svg-parser] › ...` like the following:

```typescript
// import statements

describe('[sketch-svg-parser] › ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> For tests the **jest** Framework was chosen, see [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to execute all tests specified for the Sketch SVG parser. Run `yarn test -f filename.test` to execute only tests that match the provided RegExp for the filename.

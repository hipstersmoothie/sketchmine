# @sketchmine/sketch-svg-parser

- [@sketchmine/sketch-svg-parser](#sketchminesketch-svg-parser)
  - [Dependency graph](#dependency-graph)
  - [The SVG parser](#the-svg-parser)
  - [Testing the package](#testing-the-package)


The sketch-svg-parser is used to get an SVG image and convert it to [Curve Points](https://sketchapp.com/docs/vector-editing/points-and-paths).
SVG Images consist out of Curve definitions. So an SVG describes a curve from point A to point B.
On the opposite Sketch only defines the points with their anchors and handles for the curve.

## Dependency graph

![Dependency graph of the sketchmine sketch-svg-parser](https://dt-cdn.net/images/sketch-svg-parser-3920-8bde931eda.png)


## The SVG parser

The `src/svg-parser.ts` is the entry point to this package that receives the input of the SVG as HTML string and the width and the height of the provided SVG.

The width and the height can be received in a browser through the `$0.getBoundingClientRect()` that provides a DOMRect with the actual width and height of the SVG Element.

```typescript
export class SvgParser {
  static parse(svg: string, width: number, height: number): ISvg { }
  ...
}
```

In the case of the library, the *sketch-svg-parser* gets called by the *sketch-builder* in the `element-drawer.ts` with the following code.

First of all, the **SvgParser** parses the SVGElement and then the object gets converted by the **SvgToSketch** class that returns the Sketch-AST of an SVG Element.

```typescript
private generateSVG(element: ITraversedDomSvgNode) {
  log.debug(chalk`\tAdd SVG 📈  ${element.className}`);
  const size = this.getSize(element);
  const svgObject = SvgParser.parse(element.html, size.width, size.height);
  // svgObject.shapes.map(shape => overrideSvgStyle(shape.style, element.styles));
  // const styles = this.addStyles(element);

  const svg = new SvgToSketch(svgObject, size);
  svg.styles = element.styles;

  this.layers.push(...svg.generateObject());
}
```

## Testing the package

To ensure that the svg-parser is working, write tests and put them in a proper named file.

**Important!**

All tests according to this package should be wrapped in a describe with the prefix: `[sketch-svg-parser] › ...` like the following:

```typescript
// import statements

describe('[sketch-svg-parser] › ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> For tests the **jest** Framework was chosen, see [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to run all tests specified for SVG parser. Run `yarn test -f filename.test` to run only tests that matches the provided RegExp for the filename.

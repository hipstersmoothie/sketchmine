import { Style, ShapeGroup, IBounding, SketchStyle } from '@sketchmine/sketch-file-format';
import { Logger, StyleDeclaration } from '@sketchmine/helpers';
import { ISvgPointGroup, ISvg } from './interfaces';
import { SvgPointsToSketch } from './svg-points-to-sketch';
import { addCssStyleToSvg } from './util';
import chalk from 'chalk';

const log = new Logger();

export class SvgToSketch {

  styles: StyleDeclaration;

  constructor(public svgObject: ISvg, public size: IBounding) { }

  generateObject(): any[] {
    const shapeGroupLayers = [];
    const groupLayers = [];

    for (let i = 0, max = this.svgObject.shapes.length; i < max; i += 1) {
      const shape = this.svgObject.shapes[i];
      // if the paths/rects or Elements have different styles like varying fills
      // it is not possible to group them so we need a own shape group for each fill/style
      if (!this.hasNoStyles()) {
        log.debug(chalk` The SVG has inline styles: `, JSON.stringify(shape.style, null, 2));
        const shapeGroup = new ShapeGroup(this.size);
        shapeGroup.addLayer(SvgPointsToSketch.parse(shape, { ...this.size, x: 0, y: 0 }));
        shapeGroup.name = 'SVG';
        shapeGroup.style = addSvgShapeStyle(shape);
        groupLayers.push(shapeGroup.generateObject());
      } else {
        shapeGroupLayers.push(SvgPointsToSketch.parse(shape, { ...this.size, x: 0, y: 0 }));
      }
    }

    if (this.hasNoStyles()) {
      const shapeGroup = new ShapeGroup(this.size);
      shapeGroup.name = 'SVG';
      shapeGroup.layers = shapeGroupLayers;
      if (this.styles) {
        shapeGroup.addRotation(this.styles.transform);
        shapeGroup.style = addCssStyleToSvg(this.styles);
      }
      groupLayers.push(shapeGroup.generateObject());
    }
    return groupLayers;
  }
  /**
   * Checks if some styles are set on the svg shapes
   */
  private hasNoStyles(): boolean {
    return this.svgObject.shapes.every(shape => shape.style.size === 0);
  }
}

function addSvgShapeStyle(shape: ISvgPointGroup): SketchStyle {
  const shapeStyle = shape.style;
  const style = new Style();

  const fill = shapeStyle.get('fill');
  const fillOpacity = parseInt(shapeStyle.get('fillOpacity'), 10) || 1;
  const stroke = shapeStyle.get('stroke');
  const strokeWidth = parseInt(shapeStyle.get('strokeWidth'), 10);

  if (fill && fill !== 'inherit') {
    style.addFill(fill, fillOpacity);
  }
  if (strokeWidth > 0) {
    style.addBorder(stroke, strokeWidth);
  }
  return style.generateObject();
}

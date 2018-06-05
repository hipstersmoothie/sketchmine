import { ISvgPointGroup, ISvg } from './interfaces/ISvg';
import { IShapeGroup } from './interfaces/ShapeGroup';
import { ShapeGroup } from './models/ShapeGroup';
import { IBounding } from '../sketchJSON/interfaces/Base';
import { SvgPointsToSketch } from './SvgPointsToSketch';
import { Style } from '../sketchJSON/models/Style';
import { IStyle } from '../sketchJSON/interfaces/Style';
import chalk from 'chalk';
import { addCssStyleToSvg } from './util/styles';

export class SvgToSketch {

  private _styles: CSSStyleDeclaration;

  set styles(styles: CSSStyleDeclaration) { this._styles = styles; }
  constructor(private _svgObject: ISvg) { }

  generateObject(): any[] {

    const size: IBounding = { ...this._svgObject.size, x: 0, y: 0 };
    const shapeGroupLayers = [];
    const groupLayers = [];

    this._svgObject.shapes.forEach((shape) => {
      // if the paths/rects or Elements have different styles like varying fills
      // it is not possible to group them so we need a own shape group for each fill/style
      if (process.env.DEBUG_SVG) {
        if (!this.hasNoStyles()) {
          console.log(chalk`   The SVG has inline styles: `, JSON.stringify(shape.style, null, 2));
        }
      }
      if (!this.hasNoStyles()) {
        const shapeGroup = new ShapeGroup(size);
        shapeGroup.addLayer(SvgPointsToSketch.parse(shape, size));
        shapeGroup.name = 'SVG';
        shapeGroup.style = addSvgShapeStyle(shape);
        groupLayers.push(shapeGroup.generateObject());
        return;
      }
      shapeGroupLayers.push(SvgPointsToSketch.parse(shape, size));
    });

    if (this.hasNoStyles()) {
      const shapeGroup = new ShapeGroup(size);
      shapeGroup.name = 'SVG';
      shapeGroup.layers = shapeGroupLayers;
      if (this._styles) {
        shapeGroup.style = addCssStyleToSvg(this._styles);
      }
      groupLayers.push(shapeGroup.generateObject());
    }
    return groupLayers;
  }
  /**
   * Checks if some styles are set on the svg shapes
   */
  private hasNoStyles(): boolean {
    return this._svgObject.shapes.every(shape => shape.style.size === 0);
  }
}

function addSvgShapeStyle(shape: ISvgPointGroup): IStyle {
  const shapeStyle = shape.style;
  const style = new Style();

  const fill = shapeStyle.get('fill');
  const fillOpacity = parseInt(shapeStyle.get('fillOpacity'), 10) || 1;
  const stroke = shapeStyle.get('stroke');
  const strokeWidth = parseInt(shapeStyle.get('strokeWidth'), 10);

  if (fill && fill !== 'inherit') {
    style.addColorFill(fill, fillOpacity);
  }
  if (strokeWidth > 0) {
    style.addBorder(stroke, strokeWidth);
  }
  return style.generateObject();
}

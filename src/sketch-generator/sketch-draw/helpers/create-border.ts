import { Border, resolveBorder } from './resolve-border';
import { StyleDeclaration } from '../../../dom-traverser/dom-visitor';
import { CurvePoint } from '../models/curve-point';
import { CurvePointMode } from './sketch-constants';
import { ShapePath } from '../models/shape-path';
import { IBounding } from '../interfaces';
import { Style } from '../models/style';

/**
 * Creates Border Manual with Lines (Shape with points)
 * if only borderTop or borderLeft ... is set
 * @param styles StyleDeclaration to get the border props
 * @param frame Frame of the element that has the border
 */
export function createBorder(styles: StyleDeclaration, frame: IBounding) {

  const border = resolveBorder(styles);
  if (!border || !Array.isArray(border)) { return []; }

  const max = 4; // rectangle only has 4 sides ;)
  const shapes = [];
  let points = [];

  for (let i = 0; i < max; i += 1) {
    const curSide: Border = border[i];
    const nextSide: Border = border[next(i)];

    if (!curSide) { continue; }
    const curPoint = new CurvePoint(getPointForIndex(i));
    const nextPoint = new CurvePoint(getPointForIndex(next(i)));
    // set point behaviour to straight – no curves
    curPoint.curveMode = CurvePointMode.Straight;
    curPoint.radius = getBorderRadius(i);
    nextPoint.curveMode = CurvePointMode.Straight;
    nextPoint.radius = getBorderRadius(next(i));

    if (points.length < 1) {
      // if it is the first item we need to push the beginning point as well
      points.push(curPoint.generateObject(), nextPoint.generateObject());
    } else {
      points.push(nextPoint.generateObject());
    }
    // create new shape if nextBorder has different styling
    if (
      nextSide === null ||
      nextSide && curSide.color !== nextSide.color ||
      nextSide && curSide.style !== nextSide.style ||
      nextSide && curSide.width !== nextSide.width
    ) {
      newShape(curSide);
    }
  }

  if (points.length) {
    const lastBorder = border
      .reverse()
      .find(b => b !== null);
    newShape(lastBorder);
  }

  return shapes;

  /**
   * Draws the shape that holds the points
   * @param index index of the shape from 0 to 3
   * 0 = top ... 3 = left
   */
  function newShape(curSide: Border) {
    const style = new Style();
    const shape = new ShapePath(frame);
    style.addBorder(curSide.color, curSide.width);
    shape.name = 'Border';
    shape.points = points;
    shape.style = style.generateObject();
    shapes.push(shape.generateObject());
    points = [];
  }

  function getBorderRadius(index: number): number {
    switch (index) {
      case 0: return parseInt(styles.borderTopLeftRadius, 10);
      case 1: return parseInt(styles.borderTopRightRadius, 10);
      case 2: return parseInt(styles.borderBottomRightRadius, 10);
      case 3: return parseInt(styles.borderBottomLeftRadius, 10);
    }
  }

  function next(cur: number): number {
    if (cur < max - 1) { return cur + 1; }
    return 0;
  }
}

/**
 * returns points (x and y) for each point in a rectangle
 * @param index 0 - 3
 */
export function getPointForIndex(index: number) {
  switch (index) {
    case 0: return { x: 0, y: 0 };
    case 1: return { x: 1, y: 0 };
    case 2: return { x: 1, y: 1 };
    case 3: return { x: 0, y: 1 };
  }
}

import chalk from 'chalk';
import { DOMParser } from 'xmldom';
import {
  ISvgPoint,
  ISvgPointGroup,
  ISvgView,
  ISvg,
  ISvgShape,
  ISvgArcPoint,
} from './interfaces';
import { BooleanOperation } from '@sketch-draw/helpers/sketch-constants';
import { Circle } from './models/circle';
import { Rect } from './models/rect';
import { addStyles, arcsToCurves } from './util';
import { Logger } from '@utils';

const { parseSVG, makeAbsolute } = require('svg-path-parser');
const log = new Logger();

export class SvgParser {
  static parse(svg: string, width: number, height: number): ISvg {
    return new SvgParser(svg, width, height).groupPathsToShapes();
  }

  private _viewBox: ISvgView;
  private _paths: ISvgShape[] = [];

  constructor(
    private _svg: string,
    private _width: number,
    private _height: number,
  ) {}

  /**
   * Parses SVG Element from string and make coordinate Object with absolute coordinates
   * store it in this._paths object
   */
  private getPaths() {
    try {
      const svg = new DOMParser()
        .parseFromString(this._svg.trim(), 'application/xml')
        .childNodes[0] as SVGElement;

      if (svg.tagName !== 'svg') {
        throw new Error(chalk`No SVG element provided for parsing!\nyou provided:{grey \n${this._svg}\n\n}`);
      }

      this._viewBox = this.getSize(svg);

      [].slice.call(svg.childNodes).forEach((child: Node) => {
        // if nodeType is not an ELEMENT_NODE return
        if (child.nodeType !== 1) { return; }

        let element: ISvgShape;

        if (child.nodeName === 'path') {
          const pathData = (child as SVGPathElement).getAttribute('d');
          const path = makeAbsolute(parseSVG(pathData)) as ISvgPoint[];
          const resized = this.resizeCoordinates(path);

          // TODO: fix Arcs and convert arcs to curves
          // element = { points: arcsToCurves(resized) };
          element = { points: resized };

        } else if (child.nodeName === 'circle') {
          const circle = child as SVGCircleElement;
          element = { points: this.circleToPath(circle) };
        } else if (child.nodeName === 'rect') {
          const rect = child as SVGRectElement;
          element = { points: this.rectToPath(rect) };
        } else {
          log.debug(
            chalk`{red The SVG element: "${child.nodeName}" is not implemented yet!} 😢 Sorry 🙁
            Try to render without this Element...`,
          );
        }

        if (element) {
          this._paths.push(addStyles(child as Element, element, this._viewBox));
        }
      });

    } catch (error) {
      throw new Error(chalk`\n\n🚨 {bgRed Failed to parse the SVG DOM:} 🖼\n${error}`);
    }
  }

  /**
   * group multiple <path></path> Elementens to a 2D array of shapes
   *
   * @returns ISvg[]
   */
  private groupPathsToShapes(): ISvg {
    this.getPaths();
    const shapeGroups: ISvgPointGroup[] = [];
    this._paths.forEach((element) => {
      shapeGroups.push(...this.splitPathInGroups(element));
    });
    return {
      shapes: shapeGroups,
      size: { width: this._width, height: this._height },
    };
  }

  /**
   * SVGO puts multiple Movetos and Closepaths in one path element.
   * so this function is to ungroup the path element if it is compressed
   *
   * @param element ISvgShape
   * @returns ISvgPointGroup[]
   */
  private splitPathInGroups(element: ISvgShape): ISvgPointGroup[] {
    const group: ISvgPointGroup[] = [];
    let shape: ISvgPointGroup = null;

    for (let i = 0, max = element.points.length - 1; i <= max; i += 1) {
      const _el = element.points[i];
      switch (_el.code) {
        case 'M':
          if (shape !== null) {
            group.push(shape);
            shape = null;
          }
          shape = {
            booleanOperation: BooleanOperation.None,
            style: element.style,
            points: [_el],
          };
          break;
        case 'Z':
          shape.points.push(_el);
          group.push(shape);
          shape = null;
          break;
        default:
          shape.points.push(_el);
      }

      // if path is not closed with a Z
      if (i === max && shape !== null) {
        group.push(shape);
      }
    }
    return group;
  }

  /**
   * Extract the svg Size from the view box and the width and height coordinates
   * and returns { width, height } Object
   *
   * @returns ISvgView{ width: number, height:number }
   * @param svg SVGElement
   */
  private getSize(svg: SVGElement): ISvgView {
    const w = svg.getAttribute('width');
    const h = svg.getAttribute('height');
    const v = svg.getAttribute('viewBox').split(' ');
    if (v.length > 1) {
      return {
        width: parseInt(v[2], 10),
        height: parseInt(v[3], 10),
      };
    }
    return {
      width: parseInt(w, 10),
      height: parseInt(h, 10),
    };
  }

  /**
   * Converts a circle in 4 anchorpoints to render them in Sketch
   *
   * @param _circle: SVGCircleElement
   * @returns ISvgPoint[]
   */
  private circleToPath(_circle: SVGCircleElement): ISvgPoint[] {
    const factor: ISvgView = { ...this._viewBox };
    const cx = parseInt(_circle.getAttribute('cx'), 10) / factor.width;
    const cy = parseInt(_circle.getAttribute('cy'), 10) / factor.height;
    const radius = parseInt(_circle.getAttribute('r'), 10) / factor.width;

    const circle = new Circle(cx, cy, radius).generate();
    return circle;
  }

  /**
   * Converts a rectangle to 4 Lines
   *
   * @param _rect SVGRectElement
   * @returns ISvgPoint[]
   */
  private rectToPath(_rect: SVGRectElement): ISvgPoint[] {
    const factor: ISvgView = { ...this._viewBox };
    const width = parseInt(_rect.getAttribute('width'), 10) / factor.width;
    const height = parseInt(_rect.getAttribute('height'), 10) / factor.height;
    const x = parseInt(_rect.getAttribute('x'), 10) / factor.width;
    const y = parseInt(_rect.getAttribute('y'), 10) / factor.width;

    const rect = new Rect(width, height, x, y).generate();
    return rect;
  }

  /**
   * Takes an Array of points and resizes the coordinates that the max width is 1 and the beginning is 0
   * Sketch SVGs reach from 0 to 1 (like percentage)
   *
   * @returns ISvgPoint[]
   * @param path ISvgPoint[] Array of Svg Points
   */
  private resizeCoordinates(path: (ISvgPoint | ISvgArcPoint)[]): ISvgPoint[] {
    const resized = [];
    const factor: ISvgView = { ...this._viewBox };
    path.forEach((point) => {
      const p = {
        ...point,
        x: (!isNaN(point.x)) ? point.x / factor.width : null,
        y: (!isNaN(point.y)) ? point.y / factor.height : null,
      };
      if (!isNaN(point.x0)) { p.x0 = point.x0 / factor.width; }
      if (!isNaN(point.x1)) { p.x1 = point.x1 / factor.width; }
      if (!isNaN(point.x2)) { p.x2 = point.x2 / factor.width; }
      if (!isNaN(point.y0)) { p.y0 = point.y0 / factor.height; }
      if (!isNaN(point.y1)) { p.y1 = point.y1 / factor.height; }
      if (!isNaN(point.y2)) { p.y2 = point.y2 / factor.height; }

      if (point.code === 'a' || point.code === 'A') {
        if (!isNaN((point as ISvgArcPoint).rx)) { (p as ISvgArcPoint).rx = (point as ISvgArcPoint).rx / factor.height; }
        if (!isNaN((point as ISvgArcPoint).ry)) { (p as ISvgArcPoint).ry = (point as ISvgArcPoint).ry / factor.height; }
      }

      resized.push(p);
    });
    return resized;
  }
}

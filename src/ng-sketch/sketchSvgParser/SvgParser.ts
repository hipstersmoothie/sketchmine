import chalk from 'chalk';
import { DOMParser } from 'xmldom';
import { parseSVG, makeAbsolute } from 'svg-path-parser';
import { ISvgPoint, ISvgPointGroup, ISvgView, ISvg } from './interfaces/ISvg';
import { SvgPointsToSketch } from './SvgPointsToSketch';
import { ShapeGroup } from './models/ShapeGroup';
import { IBounding } from '../sketchJSON/interfaces/Base';
import { BooleanOperation } from '../sketchJSON/helpers/sketchConstants';

export class SvgParser {
  static parse(svg: string, width: number, height: number): ISvg {
    return new SvgParser(svg, width, height).groupPathsToShapes();
  }

  private _paths: ISvgPoint[][] = [];
  private _viewBox: ISvgView;

  constructor(
    private _svg: string, 
    private _width: number, 
    private _height: number
  ) {}

  /**
   * Parses SVG Element from string and make coordinate Object with absolute coordinates
   * store it in this._paths object 
   */
  private getPaths() {
    try {
      const svg = new DOMParser().parseFromString(this._svg.trim(), 'application/xml').childNodes[0] as SVGElement;
      if (svg.tagName !== 'svg') {
        throw new Error(chalk`No SVG element provided for parsing!\nyou provided:{grey \n${this._svg}\n\n}`);
      }

      this._viewBox = this.getSize(svg);

      [].slice.call(svg.childNodes).forEach((child: Node) => {
        if (child.nodeName !== 'path') {
          return;
        } 
        const pathData = (child as SVGPathElement).getAttribute('d');
        const path = parseSVG(pathData) as ISvgPoint[];
        
        const resized = this.resizeCoordinates(path);
        this._paths.push(makeAbsolute(resized));
      });

    } catch(error) {
      throw new Error(chalk`\n\n🚨 {bgRed Failed to parse the SVG DOM:} 🖼\n${error}`)
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
    this._paths.forEach(path => {
      shapeGroups.push(...this.splitPathInGroups(path));
    });
    return {
      shapes: shapeGroups,
      size: { width: this._width, height: this._height },
    }
  }

  /**
   * SVGO puts multiple Movetos and Closepaths in one path element.
   * so this function is to ungroup the path element if it is compressed
   * 
   * @param path ISvgPoint[]
   * @returns ISvgPointGroup[]
   */
  private splitPathInGroups(path: ISvgPoint[]): ISvgPointGroup[] {
    const group: ISvgPointGroup[] = [];
    let shape: ISvgPointGroup = null;

    for(let i = 0, max = path.length-1; i <= max; i++) {

      switch(path[i].code) {
        case 'M':
          if (shape !== null) {
            group.push(shape);
            shape = null;
          };
          shape = {
            booleanOperation: BooleanOperation.None,
            points: [path[i]],
          };
          break;
        case 'Z':
          shape.points.push(path[i]);
          group.push(shape);
          shape = null;
          break;
        default:
          shape.points.push(path[i]);
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
    if (w.includes('%') && h.includes('%')) {
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
   * Takes an Array of points and resizes the coordinates that the max width is 1 and the beginning is 0
   * Sketch SVGs reach from 0 to 1 (like percentage)
   * 
   * @returns ISvgPoint[]
   * @param path ISvgPoint[] Array of Svg Points
   */
  private resizeCoordinates(path: ISvgPoint[]): ISvgPoint[] {
    const resized = [];
    const factor: ISvgView = {...this._viewBox};
    path.forEach(point => {
      const p = {
        ...point,
        x: (!isNaN(point.x))? point.x/factor.width : null,
        y: (!isNaN(point.y))? point.y/factor.height : null,
      }
      if (!isNaN(point.x0)) { p.x0 = point.x0/factor.width; }
      if (!isNaN(point.x1)) { p.x1 = point.x1/factor.width; }
      if (!isNaN(point.x2)) { p.x2 = point.x2/factor.width; }
      if (!isNaN(point.y0)) { p.y0 = point.y0/factor.height; }
      if (!isNaN(point.y1)) { p.y1 = point.y1/factor.height; }
      if (!isNaN(point.y2)) { p.y2 = point.y2/factor.height; }

      resized.push(p);
    });
    return resized;
  }
}

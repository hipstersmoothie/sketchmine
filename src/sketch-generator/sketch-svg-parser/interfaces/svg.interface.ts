export interface ISvg {
  size: ISvgView;
  shapes: ISvgPointGroup[];
}

export interface ISvgShape {
  points: ISvgPoint[];
  style?: any;
}

export interface ISvgView {
  width: number;
  height: number;
}
/**
 *
 * booleanOperation from Sketch constants: ->
 *  export const BooleanOperation = {
 *    None: -1,
 *    Union: 0,
 *    Subtract: 1,
 *    Intersect: 2,
 *    Difference: 3
 *  };
 *
 */
export interface ISvgPointGroup {
  booleanOperation: number; // Blendmode in sketch constants
  points: ISvgPoint[];
  style: Map<SvgStyle, string>;
}

export interface ISvgPoint {
  code: string;
  command: string;
  relative?: boolean;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x0?: number;
  y0?: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export type SvgStyle = 'fill' | 'stroke' | 'strokeWidth' | 'fillOpacity' | 'strokeOpacity';

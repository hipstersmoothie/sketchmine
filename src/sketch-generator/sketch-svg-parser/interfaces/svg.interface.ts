import { BooleanOperation } from '@sketch-draw/helpers';

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

export interface ISvgPointGroup {
  booleanOperation: BooleanOperation; // Blendmode in sketch constants
  points: ISvgPoint[];
  style: Map<SvgStyle, string>;
}

export enum SVG_COMMAND_LIST {
  M = 'moveto',
  L = 'lineto',
  V = 'vertical lineto',
  H = 'horizontal lineto',
  C = 'curveto',
  S = 'smooth curveto',
  Q = 'quadratic curveto',
  T = 'smooth quadratic curveto',
  A = 'elliptical arc',
  Z = 'closepath',
}

export type SVGCode =
  'M' | 'A' | 'S' | 'C' | 'Q' | 'H' | 'V' | 'L' | 'Z' |
  'm' | 's' | 'a' | 'c' | 'q' | 'h' | 'v' | 'l' | 'z';

export interface IPoint {
  x: number;
  y: number;
}

export interface ISvgPoint {
  code: SVGCode;
  command: string;
  relative: boolean;
  x: number;
  y: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x0: number;
  y0: number;
}

export interface ISvgArcPoint extends ISvgPoint{
  rx: number;
  ry: number;
  xAxisRotation: number;
  largeArc: boolean;
  sweep: boolean;
}

export type SvgStyle = 'fill' | 'stroke' | 'strokeWidth' | 'fillOpacity' | 'strokeOpacity';

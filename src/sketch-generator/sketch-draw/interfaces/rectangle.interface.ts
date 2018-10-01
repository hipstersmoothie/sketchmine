import { IBase, IFrame } from './base.interface';
import { ICurvePoint } from '../../sketch-svg-parser/interfaces/curve-point.interface';

export interface IRectangle extends IBase {
  path: IPath;
  frame: IFrame;
  edited: boolean;
  booleanOperation: number;
  fixedRadius: number;
  hasConvertedToNewRoundCorners: boolean;
}

export interface IRectangleOptions {
  width: number;
  height: number;
  cornerRadius?: number | number[];
}

export interface IPoint {
  x: number; // 0 | 1
  y: number; // 0 | 1
}

export interface IPath {
  _class: string;
  isClosed: boolean;
  pointRadiusBehaviour: number;
  points: ICurvePoint[];
}

import { IBase, IFrame } from "./Base";

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
  cornerRadius?: number | Array<number>;
}

export interface IPoint {
  x: number; // 0 | 1
  y: number;// 0 | 1
}

export interface ICurvePoint {
  _class: string;
  cornerRadius: number;
  curveFrom: string;
  curveMode: number;
  curveTo: string;
  hasCurveFrom: boolean;
  hasCurveTo: boolean;
  point: string;
}

export interface IPath {
  _class: string;
  isClosed: boolean;
  pointRadiusBehaviour: number;
  points: ICurvePoint[];
}

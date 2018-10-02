import { SketchShapePath } from '@sketch-draw/interfaces/shape-path.interface';

export interface SketchRectangle extends SketchShapePath {
  fixedRadius: number;
  hasConvertedToNewRoundCorners: boolean;
}

export interface IPoint {
  x: number; // 0 | 1
  y: number; // 0 | 1
}

import { SketchBase } from './base.interface';

export interface SketchShapeGroup extends SketchBase {
  hasClickThrough: boolean;
  clippingMaskMode: number;
  hasClippingMask: boolean;
  windingRule: number;
}

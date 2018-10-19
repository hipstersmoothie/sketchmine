import { SketchBase, SketchClippingMask } from './base.interface';

export interface SketchShapeGroup extends SketchBase, SketchClippingMask {
  hasClickThrough: boolean;
  windingRule: number;
}

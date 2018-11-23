import { SketchBase, SketchClippingMask } from './base.interface';
import { SketchOverrideValue } from './override-value';

export interface SketchSymbolInstance extends SketchBase, SketchClippingMask {
  overrideValues: SketchOverrideValue[];
  scale: number; // default 1
  symbolID: string;
  verticalSpacing: number; // default 0
}

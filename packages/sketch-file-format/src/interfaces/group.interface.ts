import { SketchBase } from './base.interface';
import { BooleanOperation } from '../helpers';

export interface SketchGroup extends SketchBase {
  booleanOperation: BooleanOperation;
  isFixedToViewport: boolean;
}

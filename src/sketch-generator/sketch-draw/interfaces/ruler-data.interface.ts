import { SketchObjectTypes } from './base.interface';

export interface SketchRulerData {
  _class: SketchObjectTypes.RulerData;
  base: number;
  guides: any[];
}

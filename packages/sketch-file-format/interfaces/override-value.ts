import { SketchObjectTypes } from './base.interface';

export interface SketchOverrideValue {
  _class:  SketchObjectTypes.OverrideValue;
  do_objectID: string;
  overrideName: string;
  value: string;
}

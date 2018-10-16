import { ValidationError } from '../error/validation-error';
import { SketchStyle, SketchFrame, SketchObjectTypes } from '@sketch-draw/interfaces';

export type ValidationFunction = (homework: IValidationContext[], currentTask: number) => (ValidationError | boolean)[];

export interface IValidationRule {
  name: string;
  selector: SketchObjectTypes[];
  validation: ValidationFunction;
  description?: string;
  ignoreArtboards?: string[];
  env?: string[];
  options?: { [key: string]: any };
  includePages?: string[];
}

export interface IValidationContext {
  _class: string;
  do_objectID: string;
  name: string;
  parents: IValidationContextParents;
  style?: SketchStyle;
  frame?: SketchFrame;
  layerSize?: number;
  ruleOptions: { [key: string]: any };
}

export interface IValidationContextParents {
  page: string;
  artboard: string;
  symbolMaster: string;
}

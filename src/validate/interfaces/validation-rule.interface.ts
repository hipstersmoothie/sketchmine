import { ValidationError } from '../error/validation-error';
import { SketchStyle, SketchFrame } from '@sketch-draw/interfaces';

export type SketchModel =
'document' |
'page' |
'symbolMaster' |
'group' |
'path' |
'shapeGroup' |
'rectangle' |
'artboard' ;
export type ValidationFunction = (homework: IValidationContext[], currentTask: number) => (ValidationError | boolean)[];

export interface IValidationRule {
  name: string;
  selector: SketchModel[];
  validation: ValidationFunction;
  description?: string;
  ignoreArtboards?: string[];
  env?: string[];
  options?: { [key: string]: any };
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

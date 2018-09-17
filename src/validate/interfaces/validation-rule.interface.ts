import { ValidationError } from '../error/validation-error';
import { IStyle, IFrame } from '@sketch-draw/interfaces';

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
}

export interface IValidationContext {
  _class: string;
  do_objectID: string;
  name: string;
  style?: IStyle;
  frame?: IFrame;
  parents: IValidationContextParents;
}

export interface IValidationContextParents {
  page: string;
  artboard: string;
  symbolMaster: string;
}

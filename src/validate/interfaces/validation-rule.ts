import { ValidationError } from '../error/validation-error';
import { IStyle } from 'ng-sketch/sketchJSON/interfaces/Style';

export type SketchModel =
'document' |
'page' |
'symbolMaster' |
'group' |
'path' |
'shapeGroup' |
'rectangle';
export type ValidationFunction = (homework: IValidationContext[], currentTask: number) => (ValidationError | boolean)[];

export interface IValidationRule {
  name: string;
  selector: SketchModel[];
  validation: ValidationFunction;
  description?: string;
  ignoreArtboards?: string[];
}

export interface IValidationContext {
  _class: string;
  do_objectID: string;
  name: string;
  style?: IStyle;
  parents: IValidationContextParents;
}

export interface IValidationContextParents {
  page: string;
  artboard: string;
  symbolMaster: string;
}

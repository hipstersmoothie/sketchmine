import { ValidationError } from '../error/ValidationError';
import { IStyle } from 'ng-sketch/sketchJSON/interfaces/Style';

export type SketchModel = 'document' | 'page' | 'symbolMaster' | 'group';
export type ValidationFunction = (homework: IValdiationContext[], currentTask: number) => ValidationError | boolean;

export interface IValidationRule {
  name: string;
  description?: string;
  selector: SketchModel;
  validation: ValidationFunction;
}

export interface IValdiationContext {
  _class: string;
  name: string;
  do_objectID: string;
  style?: IStyle;
}

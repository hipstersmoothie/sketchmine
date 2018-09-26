import { IValidationContextParents } from '../interfaces/validation-rule.interface';

export interface IValidationErrorContext {
  message: string;
  objectId: string;
  name: string;
  description?: string;
  parents?: IValidationContextParents;
}

export class ValidationError extends Error {

  public objectId: string;
  public name: string;
  public message: string;
  public description: string;
  public parents: IValidationContextParents;

  constructor(private _validationError: IValidationErrorContext, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.message = this._validationError.message;
    this.objectId = this._validationError.objectId;
    this.name = this._validationError.name;
  }
}

export class FileNameError extends ValidationError {}
export class DuplicatedSymbolError extends ValidationError { }
export class WrongSymbolNamingError extends ValidationError { }
export class ArtboardNamingError extends ValidationError { }
export class ArtboardSizeError extends ValidationError { }
export class PageNamingError extends ValidationError { }
export class ColorNotInPaletteError extends ValidationError {
  constructor(public color: string, _validationError: IValidationErrorContext) {
    super(_validationError);
  }
}

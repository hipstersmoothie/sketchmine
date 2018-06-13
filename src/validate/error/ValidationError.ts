export interface IValidationErrorContext {
  message: string;
  objectId: string;
  name: string;
}

export class ValidationError extends Error {

  public objectId: string;
  public name: string;
  public message: string;

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

export class DuplicatedSymbolError extends ValidationError { }
export class WrongSymbolNamingError extends ValidationError { }
export class ColorNotInPaletteError extends ValidationError {
  constructor(public color: string, _validationError: IValidationErrorContext) {
    super(_validationError);
  }
}

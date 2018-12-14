import { InjectionToken, Injectable, Inject, Type } from '@angular/core';

export const EXAMPLES_MAP = new InjectionToken('examples-map');

export function getBaristaNoExampleFoundError(name: string): Error {
  return Error(`[ExamplesRegistry] getExampleByName(${name}) -> No Example with the name: ${name}`);
}

@Injectable({ providedIn: 'root' })
export class ExamplesRegistry {

  constructor(@Inject(EXAMPLES_MAP) private _examplesMap: Map<string, Type<any>>) {}

  getExampleByName<T>(name: string): Type<T>|null {
    const example = this._examplesMap.get(name) || null;
    // if (!example) {
    //   console.warn(getBaristaNoExampleFoundError(name));
    // }
    return example;
  }
}

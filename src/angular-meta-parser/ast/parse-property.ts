import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseDefinition } from './parse-definition';
import { ParseType } from './parse-type';
import { ParseFunctionType } from './parse-function-type';
import { Logger } from '@utils';
import chalk from 'chalk';

const log = new Logger;

export class ParseProperty extends ParseDefinition {

  /** Array of Values that a property can have for different varients */
  private _values: any[] = [];

  constructor(
    location: ParseLocation,
    name: string,
    public type: ParseType,
  ) {
    super(name, location);
  }

  get values() { return this._values; }

  addValue(value: string): void {
    this._values.push(parseValue(value));
    log.debug(chalk`Added {grey ${value}} as varient value for {yellow ${this.name}}`, 'annotations');
  }

  isFunction(): boolean {
    return this.type instanceof ParseFunctionType;
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitProperty(this);
  }
}

function parseValue(value: string): any {
  // check if it is a number https://regex101.com/r/tDr6qG/2
  if (/^\d*[\.,\,]?\d+$/.test(value)) {
    return parseFloat(value);
  }

  // if nothing matched return it as string
  return value;
}

import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { Logger } from '@utils';
import chalk from 'chalk';

const log = new Logger;

export class ParseDefinition extends ParseNode {

  /**
   * marks a node as unrelated or internal for the design system
   * and hides it from the generated JSON output */
  private _internal = false;
  private _unrelated = false;

  constructor(public name: string, public location: ParseLocation) {
    super(location);
  }

  visit(visitor: AstVisitor): any {
    return null;
  }

  get internal(): boolean { return this._internal; }
  set internal(internal: boolean) {
    this._internal = internal;
    log.debug(chalk`Mark {red ${this.name}} as {bgRed  @internal }`, 'annotations');
  }
  get unrelated(): boolean { return this._unrelated; }
  set unrelated(unrelated: boolean) {
    this._unrelated = unrelated;
    log.debug(chalk`Mark {red ${this.name}} as {bgRed  @design-unrelated }`, 'annotations');
  }
}

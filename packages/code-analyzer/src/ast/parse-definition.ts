import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';

export type NodeTags = 'internal' | 'unrelated' | 'private' | 'hasUnderscore' | 'noCombinations';

/**
 * @class
 * @classdesc
 * classes that extends from `{ParseDefinition}`:
 * - `{ParseInterface}`
 * - `{ParseProperty}`
 * @extends {ParseNode}
 *
 */
export class ParseDefinition extends ParseNode {

  /**
   * @param name name of the definiton
   * @param location location is the path to the file
   * @param tags Array of jsDoc annotations like internal unrelated private
   */
  constructor(
    public name: string,
    public location: ParseLocation,
    public tags: NodeTags[] = [],
  ) {
    super(location);
  }

  visit(visitor: AstVisitor): any {
    return null;
  }
}

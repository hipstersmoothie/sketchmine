import * as ts from 'typescript';
import { getSymbolName } from './get-symbol-name';

/**
 * Get the decorator with the provided `decoratorType`
 * @param {ts.Node} node Node with decorators (ts.ClassDeclaration)
 * @param {string} decoratorType type of the decorator for example 'Component'
 * @returns {ts.Decorator | undefined} return Decorator of provided type if exist
 */
export function getDecoratorOfType(node: ts.Node, decoratorType: string): ts.Decorator | undefined {
  const decorators = node.decorators || [];

  for (let i = 0; i < decorators.length; i += 1) {
    const decorator = decorators[i] as ts.Decorator;
    const expr = decorator.expression as ts.CallExpression;
    if (expr && expr.expression) {
      if (getSymbolName(expr.expression) === decoratorType) {
        return decorator;
      }
    }
  }

  return undefined;
}

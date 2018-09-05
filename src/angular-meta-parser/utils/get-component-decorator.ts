import * as ts from 'typescript';
import { getDecoratorOfType } from './get-decorator-of-type';

/**
 * Get the content of the Component decorator
 * @param node classDeclaration Node
 */
export function getComponentDecorator(node: ts.ClassDeclaration): ts.ObjectLiteralExpression | null {
  const decorator = getDecoratorOfType(node, 'Component');
  if (!decorator) {
    return null;
  }
  const args = (decorator.expression as ts.CallExpression).arguments;
  if (args && args.length) {
    /** TODO: implement handling of multiple decorators */
    return args[0] as ts.ObjectLiteralExpression;
  }
  return null;
}

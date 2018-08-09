import * as ts from 'typescript';
import { getDecoratorOfType } from './get-decorator-of-type';

export function getComponentDecorator(node: ts.ClassDeclaration): ts.ObjectLiteralExpression | null {
  const decorator = getDecoratorOfType(node, 'Component');
  if (!decorator) {
    return null;
  }
  const args = (decorator.expression as ts.CallExpression).arguments;
  if (args && args.length) {
    return args[0] as ts.ObjectLiteralExpression;
  }
  return null;
}

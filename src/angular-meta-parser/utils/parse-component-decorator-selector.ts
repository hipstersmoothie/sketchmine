import * as ts from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { acmp } from '../typings/angular-component';

export function parseComponentDecoratorSelector(node: ts.Decorator): acmp.Meta {
  const expr = node.expression as ts.CallExpression;
  const propertyList = {};

  expr.arguments.forEach((arg: ts.ObjectLiteralExpression) => {
    arg.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop)) {
        return;
      }
      const name = prop.name.getText();

      switch (name) {
        case 'selector':
        case 'exportAs':
        case 'inputs':
          propertyList[name] = parseInitializer(prop);
          break;
      }

    });
  });

  return propertyList as acmp.Meta;
}

function parseInitializer(node: ts.PropertyAssignment): string | string[] {
  if (
    ts.isStringLiteral(node.initializer) ||
    ts.isNumericLiteral(node.initializer) ||
    ts.isNoSubstitutionTemplateLiteral(node.initializer)
  ) {
    return node.initializer.text;
  }

  if (ts.isArrayLiteralExpression(node.initializer)) {
    return node.initializer.elements.map((item) => {
      if (
        ts.isStringLiteral(item) ||
        ts.isNumericLiteral(item)
      ) {
        return item.text;
      }
    });
  }
}

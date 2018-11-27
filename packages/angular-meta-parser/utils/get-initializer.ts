import * as ts from 'typescript';

export function getInitializer(node: ts.PropertyAssignment): string | string[] {
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

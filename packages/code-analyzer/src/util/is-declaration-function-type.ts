import * as ts from 'typescript';

type DeclarationNode =
  | ts.PropertyDeclaration
  | ts.VariableDeclaration
  | ts.ParameterDeclaration;

export function isDeclarationFunctionType(node: DeclarationNode): boolean {
  if (node.type !== undefined) {
    if (node.type.getText() === 'Function') {
      return true;
    }
    return node.type.kind === ts.SyntaxKind.FunctionType;
  }

  if (node.initializer !== undefined) {
    return (
      node.initializer.kind === ts.SyntaxKind.ArrowFunction ||
      node.initializer.kind === ts.SyntaxKind.FunctionExpression
    );
  }
  return false;
}

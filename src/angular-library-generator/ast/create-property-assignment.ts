import * as ts from 'typescript';

export function createPropertyAssignment(name: string, expression: ts.Expression): ts.PropertyAssignment {
  return ts.createPropertyAssignment(
    ts.createIdentifier(name),
    expression,
  );
}

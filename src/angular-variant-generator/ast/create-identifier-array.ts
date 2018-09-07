import * as ts from 'typescript';

/**
 * generates a ArraLiteralExpression with a list of identifiers from strings
 * @param values string array that schould be converted to an array of identifiers
 * @param newline if array entries are printed in newlines
 */
export function createIdentifierArray(values: string[], newline = true): ts.ArrayLiteralExpression {
  const identifiers = values.map(val => ts.createIdentifier(val));
  return ts.createArrayLiteral(identifiers, newline);
}

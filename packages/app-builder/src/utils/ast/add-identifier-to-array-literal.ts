import * as ts from 'typescript';
import { createIdentifierArray } from './create-identifier-array';

/**
 * Adds a string identifier to an arrayLiteralExpression of identifiers.
 * @param {ts.ArrayLiteralExpression} array array of identifiers where the identifier should be added
 * @param {string} identifier the string identifier that should be added
 * @returns {ts.ArrayLiteralExpression}
 */
export function addIdentifierToArrayLiteral(
  array: ts.ArrayLiteralExpression,
  identifier: string,
): ts.ArrayLiteralExpression {
  const values = array.elements.map((ident: ts.Identifier) => ident.text);

  // if the array already contains the identifier return it.
  if (values.includes(identifier)) {
    return array;
  }
  values.push(identifier);
  // create Identifier array and return it.
  return createIdentifierArray(values);
}

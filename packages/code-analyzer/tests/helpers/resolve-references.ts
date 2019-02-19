import { ParseResult, ReferenceResolver } from '../../src';

/**
 * @description
 * Applies the reference resolver to the result.
 */
export function resolveReferences(result: ParseResult): ParseResult {
  const referenceResolver = new ReferenceResolver([result]);
  return result.visit(referenceResolver);
}

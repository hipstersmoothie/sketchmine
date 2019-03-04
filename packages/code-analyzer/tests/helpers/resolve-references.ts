import { ParseResult, ReferenceResolver } from '../../src';

/**
 * @description
 * Applies the reference resolver to the result.
 */
export function resolveReferences(result: ParseResult): ParseResult {
  const results = new Map<string, ParseResult>();
  results.set('test-case.ts', result);
  const referenceResolver = new ReferenceResolver(results);
  return result.visit(referenceResolver);
}

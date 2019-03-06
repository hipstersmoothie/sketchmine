import { ParseResult, ReferenceResolver, LOOKUP_TABLE } from '../../src';

/**
 * @description
 * Applies the reference resolver to the result.
 */
export function resolveReferences(result: ParseResult): ParseResult {
  const results = new Map<string, ParseResult>();
  results.set('test-case.ts', result);

  LOOKUP_TABLE.clear();
  const referenceResolver = new ReferenceResolver(results);
  return result.visit(referenceResolver);
}

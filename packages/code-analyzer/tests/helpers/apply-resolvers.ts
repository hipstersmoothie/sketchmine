import {
  ReferenceResolver,
  ParseResult,
} from '../../src/';

/**
 * @description
 * Applies all the transformers to the parsed result.
 */
export function applyResolvers(result: ParseResult): ParseResult {
  let transformedResult: ParseResult;

  const referenceResolver = new ReferenceResolver([result]);
  transformedResult = result.visit(referenceResolver);

  return transformedResult;
}

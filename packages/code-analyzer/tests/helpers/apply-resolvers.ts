import {
  ReferenceResolver,
  ValuesResolver,
  ParseResult,
} from '../../src/';

/**
 * @description
 * Applies all the transformers to the parsed result.
 */
export function applyResolvers(result: ParseResult): ParseResult {
  let transformedResult: ParseResult;

  const referenceResolver = new ReferenceResolver([result]);
  const valuesResolver = new ValuesResolver();
  transformedResult = result.visit(referenceResolver);
  transformedResult = result.visit(valuesResolver);

  return transformedResult;
}

import {
  JSONResolver,
  ParseResult,
} from '../../src/';
import { resolveReferences } from './resolve-references';

/**
 * @description
 * Applies the reference and JSON resolver to the result.
 */
export function resolveJSON(result: ParseResult): ParseResult {
  const resolver = new JSONResolver();
  const resolvedReferences = resolveReferences(result);
  return resolvedReferences.visit(resolver);
}

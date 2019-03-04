import { ParsedVisitor, ParseResult, ParseNode, ParseLocation } from '../parsed-nodes';
import { ReferenceResolver } from './reference-resolver';
import { MetaResolver } from './meta-resolver';
import { flatten } from 'lodash';

export function applyTransformers<T>(parsedResults: Map<string, ParseResult>): T[] {
  let metaInformation = parsedResults;
  // we need the results array to provide it to the reference resolver
  // in case that we look for root nodes in there
  // const results = Array.from(parsedResults.values());

  // list of transformers that should be applied to the
  // parsed results
  const refResolver = new ReferenceResolver(parsedResults);
  const transformers: ParsedVisitor[] = [
    refResolver,
    new MetaResolver(),
  ];

  /** applies the transformers on the AST */
  for (const transformer of transformers) {
    const transformedResults = new Map<string, ParseResult>();
    metaInformation.forEach((result, fileName) => {
      transformedResults.set(fileName, result.visit(transformer));
    });
    metaInformation = transformedResults;
  }

  const meta = Array.from(metaInformation.values());
  return flatten(meta) as unknown as T[];
}

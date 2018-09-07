import * as ts from 'typescript';
import { AMP } from '@angular-meta-parser/meta-information';
import { generateClassName } from './utils';
import { componentTransformer } from './transformers';

export function generateComponentVariants(source: string, component: AMP.Component): ts.SourceFile[] {
  const combinations: ts.SourceFile[] = [];

  for (let i = 0, max = component.variants.length; i < max; i += 1) {
    const variant = component.variants[i];
    for (let j = 0, jmax = variant.changes.length; j < jmax; j += 1) {
      const change = variant.changes[j] as AMP.VariantProperty;
      const config = {
        variantName: variant.name,
        className: `${generateClassName(variant.name)}`,
        /** TODO: handle all selectors in array not only the first */
        selector: component.selector[0],
        type: change.type,
        key: change.key,
        value: change.value,
      };
      combinations.push(generateVariant(source, config));
    }
  }
  return combinations;
}

/**
 * generates a transformed ts.SourceFile from a string
 * @param content content string of the pure example
 * @param config configuration object for the transformer
 */
function generateVariant(content: string, config: any): ts.SourceFile {
  const sourceFile = ts.createSourceFile(
    `./examples/${config.variantName}.component.ts`,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const transformedResult = ts.transform(
    sourceFile,
    [componentTransformer],
    config,
  ) as ts.TransformationResult<ts.SourceFile>;

  return transformedResult.transformed[0];
}

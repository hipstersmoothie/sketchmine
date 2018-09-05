import * as ts from 'typescript';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { MetaInformation } from '../angular-meta-parser/meta-information';
import {
  getComponentDecorator,
  getSymbolName,
  getInitializer,
  hasExportModifier,
} from '@angular-meta-parser/utils';
import { componentTransformer } from './transformers';
import { generateClassName } from './utils';

const button = require(path.join(process.cwd(), 'src', 'angular-meta-parser', '_tmp', 'meta-information.json'))
  .components[0];

function generateComponents(source: string) {
  const components: ts.SourceFile[] = [];
  components.push(...generateComponentVariants(source, button));

  for (let i = 0, max = components.length; i < max; i += 1) {
    const variant = components[i];
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const resultFile = ts.createSourceFile(variant.fileName, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    const result = printer.printNode(ts.EmitHint.Unspecified, variant, resultFile);
    /** TODO: write the variant result to the filesystem */
    console.log(result);
  }
}

function generateComponentVariants(source: string, component: MetaInformation.Component): ts.SourceFile[] {
  const combinations: ts.SourceFile[] = [];

  for (let i = 0, max = component.variants.length; i < max; i += 1) {
    const variant = component.variants[i];
    for (let j = 0, jmax = variant.changes.length; j < jmax; j += 1) {
      const change = variant.changes[j] as MetaInformation.VariantProperty;
      const config = {
        variantName: variant.name,
        className: `${generateClassName(variant.name)}`,
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
    `${config.variantName}.component.ts`,
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

const fileName = path.join(
  process.cwd(),
  'src',
  'angular-variant-generator',
  '_tmp',
  'button-pure-example.component.ts',
);
const source = readFileSync(fileName, { encoding: 'utf8' }).toString();

generateComponents(source);

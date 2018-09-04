import * as ts from 'typescript';
import * as path from 'path';
import { readFileSync } from 'fs';
import { MetaInformation } from '../angular-meta-parser/meta-information';
import { getComponentDecorator, getSymbolName, getInitializer } from '@angular-meta-parser/utils';

// function makeFactorialFunction() {
//   const functionName = ts.createIdentifier('factorial');
//   const paramName = ts.createIdentifier('n');
//   const parameter = ts.createParameter(
//     undefined, /** decorators */
//     undefined, /** modifiers */
//     undefined, /** dotDotDotToken */
//     paramName,
//   );

//   const condition = ts.createBinary(
//     paramName,
//     ts.SyntaxKind.LessThanEqualsToken,
//     ts.createLiteral(1),
//   );

//   const ifBody = ts.createBlock(
//     [ts.createReturn(ts.createLiteral(1))],
//     true, /*multiline*/
//   );
//   const decrementedArg = ts.createBinary(
//     paramName,
//     ts.SyntaxKind.MinusToken,
//     ts.createLiteral(1),
//   );
//   const recurse = ts.createBinary(
//     paramName,
//     ts.SyntaxKind.AsteriskToken,
//     ts.createCall(functionName, /*typeArgs*/ undefined, [decrementedArg]),
//   );
//   const statements = [ts.createIf(condition, ifBody), ts.createReturn(recurse)];

//   return ts.createFunctionDeclaration(
//     undefined, /*decorators*/
//     [ts.createToken(ts.SyntaxKind.ExportKeyword)], /*modifiers*/
//     undefined, /*asteriskToken*/
//     functionName,
//     undefined, /*typeParameters*/
//     [parameter],
//     ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword), /*returnType*/
//     ts.createBlock(statements, /*multiline*/ true),
//   );
// }

const button = require(path.join(process.cwd(), 'src', 'angular-meta-parser', '_tmp', 'meta-information.json'))
  .components[0];

function generateVariants(sourceFile: ts.SourceFile) {
  const variants = new Map<string, string>();
  const variant = button.variants[0];
  const file = `${variant.name}-component.ts`;

  variants.set(file, generateVariant(sourceFile, file, variant));
}

function generateVariant(
  sourceFile: ts.SourceFile,
  filen: string,
  variant: MetaInformation.VariantMethod | MetaInformation.VariantProperty,
): string {

  sourceFile.forEachChild(visitor);

  return 'should return sourcefile';
}

function visitor(node: ts.Node): ts.Node {
  console.log(node.kind === ts.SyntaxKind.ClassDeclaration);
  if (node.kind === ts.SyntaxKind.ClassDeclaration) {
    const decorator = getComponentDecorator(node as ts.ClassDeclaration);

    const name = getSymbolName(node);
    decorator.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop)) {
        return;
      }
      const name = getSymbolName(prop);

      if (name === 'template') {
        const text = getInitializer(prop) as string;
        console.log(text);
      }
    });
  }
  return node;
}

const fileName = path.join(
  process.cwd(), 'src', 'angular-variant-generator', '_tmp', 'button-pure-example.component.ts',
);

const source = readFileSync(fileName, { encoding: 'utf8' }).toString();
const sourceFile = ts.createSourceFile(
  fileName,
  source,
  ts.ScriptTarget.Latest,
  true,
);

// transformer(sourceFile);
// const printer = ts.createPrinter({
//   newLine: ts.NewLineKind.LineFeed,
// });

// const result = printer.printNode(
//   ts.EmitHint.Unspecified,
//   sourceFile,
//   sourceFile,
// );

generateVariants(sourceFile);

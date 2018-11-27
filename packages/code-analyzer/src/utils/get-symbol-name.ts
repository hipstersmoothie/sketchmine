import * as ts from 'typescript';
import chalk from 'chalk';
import { Logger } from '@sketchmine/helpers';

const log = new Logger();

/**
 * Get the name from any node
 * @param node Any Node
 */
export function getSymbolName(node): string {
  if (!node) {
    return '';
  }

  switch (node.kind) {
    case ts.SyntaxKind.VariableStatement:
      return getSymbolName(node.declarationList);
    case ts.SyntaxKind.VariableDeclarationList:
      return node.declarations.map(declaration => getSymbolName(declaration)).join(', ');
  }

  /** node is a StringLiteral */
  if (node.literal && node.literal.kind === ts.SyntaxKind.StringLiteral) {
    return node.literal.text;
  }
  /** node is a StringLiteral */
  if (node.kind && node.kind === ts.SyntaxKind.StringLiteral) {
    return node.text;
  }
  /** node is a Identifier */
  if (node.kind && node.kind === ts.SyntaxKind.Identifier) {
    return node.text;
  }
  if (node.name && node.name.kind === ts.SyntaxKind.Identifier) {
    return node.name.text;
  }
  /** node is a TypeReference */
  if (node.typeName && node.kind === ts.SyntaxKind.TypeReference) {
    return node.typeName.text;
  }

  log.warning(
    chalk`Unsupported Syntax kind {bgBlue  <${ts.SyntaxKind[node.kind]}> } ` +
    chalk`{grey – function getSymbolName(node)}`,
  );
}

import * as ts from 'typescript';
import chalk from 'chalk';
import { Logger } from './logger';

const log = new Logger();

export function getSymbolName(node): string {
  if (!node) {
    return '';
  }

  // node.name is an identifier
  if (node.name && node.name.kind === ts.SyntaxKind.Identifier) {
    return node.name.text;
  }
  // node is a literalType
  if (node.literal && node.literal.kind === ts.SyntaxKind.StringLiteral) {
    return node.literal.text;
  }

  if (node.kind && node.kind === ts.SyntaxKind.StringLiteral) {
    return node.text;
  }
  if (node.kind && node.kind === ts.SyntaxKind.Identifier) {
    return node.text;
  }

  if (node.typeName && node.kind === ts.SyntaxKind.TypeReference) {
    return node.typeName.text;
  }

  log.warning(
    chalk`Unsupported Syntax kind {bgBlue  <${ts.SyntaxKind[node.kind]}> } ` +
    chalk`{grey – function getSymbolName(node)}`,
  );
}

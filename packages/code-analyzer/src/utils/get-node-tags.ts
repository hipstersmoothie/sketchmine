import * as ts from 'typescript';
import { getSymbolName } from './get-symbol-name';
import { visitJsDoc } from './visit-jsdoc';
import {
  JSDOC_ANNOTATION_INTERNAL,
  JSDOC_ANNOTATION_UNRELATED,
  JSDOC_ANNOTATION_NO_COMBINATIONS,
} from './jsdoc-annotations';
import { hasExportModifier } from './has-export-modifier';

/**
 * @description
 * The node tags are specifying if an element is marked as private or exported,
 * internal or unrelated for our code-analyzer
 */
export type NodeTags =
  | 'exported'
  | 'hasUnderscore'
  | 'internal'
  | 'noCombinations'
  | 'private'
  | 'public'
  | 'static'
  | 'protected'
  | 'readonly'
  | 'unrelated';

/**
 * Check if a node has an **@internal** or **@design-unrelated** identifier in the jsDoc comment
 * basic blacklisting of components, properties, methods and so on.
 * @param comment string of the JsDoc comment
 * @param node The node where the information should be applied
 */
export function getNodeTags(node: ts.Node): NodeTags[] {
  const comment = visitJsDoc(node);
  const tags: NodeTags[] = [];

  if (hasExportModifier(node as any)) { tags.push('exported'); }

  if (node.modifiers) {
    node.modifiers.forEach((modifier: ts.Modifier) => {
      switch (modifier.kind) {
        case ts.SyntaxKind.PrivateKeyword:
          tags.push('private'); break;
        case ts.SyntaxKind.PublicKeyword:
          tags.push('public'); break;
        case ts.SyntaxKind.ProtectedKeyword:
          tags.push('protected'); break;
        case ts.SyntaxKind.StaticKeyword:
          tags.push('static'); break;
        case ts.SyntaxKind.ReadonlyKeyword:
          tags.push('readonly'); break;
      }
    });
  }

  const name = getSymbolName(node);

  if (name && name.startsWith('_')) {
    tags.push('hasUnderscore');
  }

  if (comment !== null) {
    if (comment.includes(JSDOC_ANNOTATION_NO_COMBINATIONS)) {
      tags.push('noCombinations');
    }
    if (comment.includes(JSDOC_ANNOTATION_INTERNAL)) {
      tags.push('internal');
    }
    if (comment.includes(JSDOC_ANNOTATION_UNRELATED)) {
      tags.push('unrelated');
    }
  }
  return tags;
}

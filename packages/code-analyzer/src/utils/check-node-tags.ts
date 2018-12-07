import * as ts from 'typescript';
import { getSymbolName } from './get-symbol-name';
import { visitJsDoc } from './visit-jsdoc';
import { NodeTags } from '../ast/parse-definition';
import {
  JSDOC_ANNOTATION_INTERNAL,
  JSDOC_ANNOTATION_UNRELATED,
  JSDOC_ANNOTATION_NO_COMBINATIONS,
} from './jsdoc-annotations';

/**
 * Check if a node has an **@internal** or **@design-unrelated** identifier in the jsDoc comment
 * basic blacklisting of components, properties, methods and so on.
 * @param comment string of the JsDoc comment
 * @param node The node where the information should be applied
 */
export function checkNodeTags(node: ts.Node): NodeTags[] {
  const comment = visitJsDoc(node);
  const tags: NodeTags[] = [];

  if (node.modifiers) {
    if (node.modifiers.find(m => m.kind === ts.SyntaxKind.PrivateKeyword)) {
      tags.push('private');
    }
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

import { checkNodeType, NodeType } from './check-node-type';

export function hasBeforeOrAfterElement(node: Element, type: ':after' | ':before'): boolean {
  if (checkNodeType(node) === NodeType.Element) {
    return getComputedStyle(node, type).content !== 'none';
  }
  return false;
}

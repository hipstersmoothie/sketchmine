export enum NodeType {
  Text = 'Text',
  Element = 'Element',
  Comment = 'Comment',
}

/**
 * this function is needed for the unit tests, in case we have to mock this part
 * in case that jest does not know the Element, Text or Comment instance.
 * @param node Node to be checked
 */
export function checkNodeType(node: Node): NodeType {
  if (node instanceof Element) {
    return NodeType.Element;
  }
  if (node instanceof Text) {
    return NodeType.Text;
  }
  if (node instanceof Comment) {
    return NodeType.Comment;
  }
}

import { DomVisitor } from './dom-visitor';
import { ITraversedElement, ITraversedDomElement } from './traversed-dom';

export enum NodeType {
  Text = 'Text',
  Element = 'Element',
  Comment = 'Comment',
}

/**
 * @description
 * Traverser that runs through the DOM and visits every node with a visitor
 */
export class DomTraverser {
  nodeCount = 0;
  elementCount = 0;
  attributeCount = 0;
  textCount = 0;
  commentCount = 0;

  /**
   * this function is needed for the unit tests, in case we have to mock this part
   * in case that jest does not know the Element, Text or Comment instance.
   * @param node Node to be checked
   */
  checkNodeType(node: Node): NodeType {
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

  traverse(node, visitor: DomVisitor): ITraversedElement {
    if (!node) {
      throw new Error('No node was passed to the traverse function, maybe the root Element does not exist!');
    }

    this.nodeCount += 1;
    let treeLevel: ITraversedElement;

    switch (this.checkNodeType(node)) {
      case NodeType.Element:
        this.elementCount += 1;
        treeLevel = visitor.visitElement(node);
        break;
      case NodeType.Text:
        this.textCount += 1;
        treeLevel = visitor.visitText(node);
        break;
      case NodeType.Comment:
        this.commentCount += 1;
        break;
    }
    // Start traversing the child nodes
    let childNode = node.firstChild;
    if (childNode) {
      (treeLevel as ITraversedDomElement).children = [];
      const n = this.traverse(childNode, visitor);
      if (n) {
        (treeLevel as ITraversedDomElement).children.push(n);
      }
      while (childNode = childNode.nextSibling) {
        const cn = this.traverse(childNode, visitor);
        if (cn) {
          (treeLevel as ITraversedDomElement).children.push(cn);
        }
      }
    }
    return treeLevel;
  }
}

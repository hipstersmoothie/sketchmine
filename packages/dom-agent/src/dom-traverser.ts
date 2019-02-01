import { DomVisitor } from './dom-visitor';
import { ITraversedElement, ITraversedDomElement, Traverser } from './public-api';
import { checkNodeType, NodeType, hasBeforeOrAfterElement } from './helpers';

/**
 * @description
 * Traverser that runs through the DOM and visits every node with a visitor
 */
export class DomTraverser implements Traverser {
  nodeCount = 0;
  elementCount = 0;
  attributeCount = 0;
  textCount = 0;
  commentCount = 0;

  traverse(node: any, visitor: DomVisitor): ITraversedElement {
    if (!node) {
      throw new Error('No node was passed to the traverse function, maybe the root Element does not exist!');
    }

    this.nodeCount += 1;
    let treeLevel: ITraversedElement;

    switch (checkNodeType(node)) {
      case NodeType.Element:
        this.elementCount += 1;
        treeLevel = visitor.visitElement(node) as ITraversedDomElement;
        break;
      case NodeType.Text:
        this.textCount += 1;
        treeLevel = visitor.visitText(node);
        break;
      case NodeType.Comment:
        this.commentCount += 1;
        break;
    }

    if (hasBeforeOrAfterElement(node, ':before')) {
      addChild(treeLevel as ITraversedDomElement, visitor.visitBeforeOrAfterElement(node, ':before'));
    }

    // Start traversing the child nodes
    let childNode = node.firstChild;
    if (childNode) {
      addChild(treeLevel as ITraversedDomElement, this.traverse(childNode, visitor));

      while (childNode = childNode.nextSibling) {
        addChild(treeLevel as ITraversedDomElement, this.traverse(childNode, visitor));
      }
    }

    if (hasBeforeOrAfterElement(node, ':after')) {
      addChild(treeLevel as ITraversedDomElement, visitor.visitBeforeOrAfterElement(node, ':after'));
    }

    return treeLevel;
  }
}

function addChild(parent: ITraversedDomElement, child: ITraversedElement): void {
  if (!child) { return; }

  if (parent.children && parent.children.length) {
    parent.children.push(child);
  } else {
    parent.children = [child]
  }
}

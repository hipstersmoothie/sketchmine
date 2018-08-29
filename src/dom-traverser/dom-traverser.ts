export class DomTraverser {
  private _nodeCount = 0;
  private _elementCount = 0;
  private _attributeCount = 0;
  private _textCount = 0;
  private _commentCount = 0;

  constructor() { }

  traverse(node, visitor) {
    this._nodeCount += 1;
    let treeLevel;

    if (node instanceof Element) {
      this._elementCount += 1;
      treeLevel = { ...visitor.visitElement(node) };
    } else if (node instanceof Text) {
      this._textCount += 1;
      treeLevel = { ...visitor.visitText(node) };
    } else if (node instanceof Comment) {
      this._commentCount += 1;
    }

    // Start traversing the child nodes
    let childNode = node.firstChild;
    if (childNode) {
      treeLevel.children = [];
      treeLevel.children.push(this.traverse(childNode, visitor));
      while (childNode = childNode.nextSibling) {
        treeLevel.children.push(this.traverse(childNode, visitor));
      }
    }
    return treeLevel;
  }
}

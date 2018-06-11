class AssetHelper {

  get assets() { return this._assets }
  addAsset(id, src) { 
    if (!Object.values(this._assets).includes(src)) {
      this._assets.push({[id]:  src});
    }
  }
  
  constructor() { this._assets = [] }
}
class UUID {
  constructor() {
    this.lut = [];
    for (let i = 0; i < 256; i += 1) {
      this.lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }
  }

  static generate() {
    return new UUID().calculate().toUpperCase();
  }

  calculate() {
    const d0 = Math.random() * 0xffffffff | 0;
    const d1 = Math.random() * 0xffffffff | 0;
    const d2 = Math.random() * 0xffffffff | 0;
    const d3 = Math.random() * 0xffffffff | 0;
    return this.lut[d0 & 0xff] +
      this.lut[d0 >> 8 & 0xff] +
      this.lut[d0 >> 16 & 0xff] +
      this.lut[d0 >> 24 & 0xff] + '-' +
      this.lut[d1 & 0xff] +
      this.lut[d1 >> 8 & 0xff] + '-' +
      this.lut[d1 >> 16 & 0x0f | 0x40] +
      this.lut[d1 >> 24 & 0xff] + '-' +
      this.lut[d2 & 0x3f | 0x80] +
      this.lut[d2 >> 8 & 0xff] + '-' +
      this.lut[d2 >> 16 & 0xff] +
      this.lut[d2 >> 24 & 0xff] +
      this.lut[d3 & 0xff] +
      this.lut[d3 >> 8 & 0xff] +
      this.lut[d3 >> 16 & 0xff] +
      this.lut[d3 >> 24 & 0xff];
  }
}

class DomTraverser {

  constructor() {
    this._nodeCount = 0;
    this._elementCount = 0;
    this._attributeCount = 0;
    this._textCount = 0;
    this._commentCount = 0;
   }

  traverse(node, visitor) {
    this._nodeCount++;
    let treeLevel;

    if (node instanceof Element) {
      this._elementCount++;
      treeLevel = {...visitor.visitElement(node) };
    } else if (node instanceof Text) {
      this._textCount++;
      treeLevel = {...visitor.visitText(node) };
    } else if (node instanceof Comment) {
      this._commentCount++;
    }

    // Start traversing the child nodes
    let childNode = node.firstChild;
    if (childNode) {
      treeLevel.children = []
      treeLevel.children.push(this.traverse(childNode, visitor));
      while (childNode = childNode.nextSibling) {
        treeLevel.children.push(this.traverse(childNode, visitor));
      }
    }
    return treeLevel;
  }
}

var images = new AssetHelper();

class DomVisitor {
  visitElement(element) {
    const className = (typeof element.className === 'string')? element.className.split(' ').join('\/') : undefined;
    const tagName = element.tagName.toUpperCase()
    const el = { 
      tagName: tagName,
      className: className,
      parentRect: (element.parentNode) ? element.parentNode.getBoundingClientRect() : {},
      boundingClientRect: element.getBoundingClientRect(),
      styles: this.getStyle(element),
    };

    switch (tagName) {
      case 'SVG':
        el.html = element.outerHTML;
        break;
      case 'IMG':
        const src = element.getAttribute('src');
        const id = '0eb712f3ed57e30fb078c486fd246513eb79cb84'; //UUID.generate();
        el.src = `images/${id}.${src.split('.').pop()}`;
        el.name = src;
        images.addAsset(src, id);
        break;
    }

    return el;   
  }

  /**
   * Gathers information about a Textnode
   * @param text TextNode 
  */
  visitText(text) {
    return {
      tagName: 'TEXT',
      parentRect: text.parentNode.getBoundingClientRect(),
      styles: this.getStyle(text.parentNode), 
      text: text.textContent,
    }
  }

  /**
   * Gathers the CSS Style Declaration of an Element
   * @param element Element 
   * @returns CSSStyleDeclaration
   */
  getStyle(element) {
    const style = JSON.parse(JSON.stringify(getComputedStyle(element)));
    return style;
  }
}


const hostElement = document.querySelector(window.TRAVERSER_SELECTOR);
const visitor = new DomVisitor();
const tree = new DomTraverser();

const element = tree.traverse(hostElement, visitor);

console.dir(element);

window.TREE = JSON.stringify({
  pageUrl: window.location.pathname.substr(1),
  pageTitle: document.title,
  assets: images.assets,
  element,
});

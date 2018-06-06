function visitElement(element, parentNode) {
  const className = (typeof element.className === 'string')? element.className.split(' ').join('\/') : undefined;
  const styles = JSON.parse(JSON.stringify(getComputedStyle(element))); // Workaround Hack   
  const el = {
    tagName: element.tagName.toUpperCase(),
    className: className,
    parentRect: (parentNode)? parentNode.getBoundingClientRect():  {},
    boundingClientRect: element.getBoundingClientRect(),
    styles: dumpUnusedStyles(styles), 
  }
  if (element.tagName === 'svg') {
    el.html = element.outerHTML;
  }
  return el;
}

function dumpUnusedStyles(styles) {
  const used = [
    'backgroundColor',
    'backgroundImage',
    'borderColor',
    'borderWidth',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'fontFamily',
    'fontWeight',
    'fontSize',
    'fill',
    'stroke',
    'strokeWidth',
    'lineHeight',
    'letterSpacing',
    'color',
    'textTransform',
    'textDecorationLine',
    'textAlign',
    'justifyContent',
    'display',
    'boxShadow',
    'opacity',
    'padding',
    'whiteSpace'
  ];
  const usedStyles = {}
  for (const key in styles) {
    if (used.includes(key)) {
      usedStyles[key] = styles[key];
    }
  }
  // return usedStyles;
  return styles;
}

function visitText(text, parentNode) {
  const styles = JSON.parse(JSON.stringify(getComputedStyle(parentNode)));
  return { 
    tagName: 'TEXT',
    parentRect: (parentNode)? parentNode.getBoundingClientRect():  {},
    styles:  dumpUnusedStyles(styles), 
    text: text.textContent 
  }
}

const unsupportedNodeNames = [
  'SCRIPT',
  'LINK',
  'META',
  'STYLE',
]

function traverse(node, parentNode = undefined) {
  if(node instanceof Comment) {
    return
  }
  let tree = {}
  if (node instanceof Element) {
    // if (unsupportedNodeNames.includes(node.nodeName)) {
    //   return;
    // }
    tree = Object.assign(tree, visitElement(node, parentNode));
  } else if (node instanceof Text) {
    tree = Object.assign(tree, visitText(node, parentNode));
  }

  if(node.hasChildNodes()) {
    tree.children = [];
    [].slice.call(node.childNodes).forEach(childNode => {
      const el = traverse(childNode, node);
      if(el) {
        tree.children.push(traverse(childNode, node))
      }
    })
  }
  return tree;
}

const elements = [];
const rootElements = [].slice.call(document.querySelectorAll(window.TRAVERSER_SELECTOR));
rootElements.forEach(element => {
  const el = traverse(element);
  if(el) {
    elements.push(traverse(element));
  }
});

window.localStorage.setItem('tree', JSON.stringify({
  pageUrl: window.location.pathname.substr(1),
  pageTitle: document.title,
  elements
}));

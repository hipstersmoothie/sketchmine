function visitElement(element, parentNode) {
  const className = (typeof element.className === 'string')? element.className.split(' ').join('\/') : undefined;
  return {
    tagName: element.tagName.toUpperCase(),
    className: className,
    parentRect: (parentNode)? parentNode.getBoundingClientRect():  {},
    boundingClientRect: element.getBoundingClientRect(),
    styles: JSON.parse(JSON.stringify(getComputedStyle(element))), // Workaround Hack    
  }
}

function visitText(text, parentNode) {
  return { 
    tagName: 'TEXT',
    parentRect: (parentNode)? parentNode.getBoundingClientRect():  {},
    styles: JSON.parse(JSON.stringify(getComputedStyle(parentNode))),
    text: text.textContent 
  }
}

function traverse(node, parentNode = undefined) {
  if(node instanceof Comment) {
    return
  }
  let tree = {}
  if (node instanceof Element) {
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
// const rootElements = [].slice.call(document.querySelectorAll('app-root > *'));
const rootElements = [].slice.call(document.querySelectorAll('app-root > * > *'));
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

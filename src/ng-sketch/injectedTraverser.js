function visitElement(element, parentNode) {
  return {
    tagName: element.tagName,
    className: element.className.split(' ').join('\/'),
    parentRect: (parentNode)? parentNode.getBoundingClientRect():  {},
    boundingClientRect: element.getBoundingClientRect(),
    styles: JSON.parse(JSON.stringify(getComputedStyle(element))), // Workaround Hack    
  }
}

function visitText(text) {
  return { 
    tagName: 'TEXT',
    text: text.textContent 
  }
}

function traverse(node, parentNode = undefined) {
  let tree = {}
  if (node instanceof Element) {
    tree = Object.assign(tree, visitElement(node, parentNode));
  } else if (node instanceof Text) {
    tree = Object.assign(tree, visitText(node));
  }

  if(node.hasChildNodes()) {
    tree.children = [];
    [].slice.call(node.childNodes).forEach(childNode => {
      tree.children.push(traverse(childNode, node))
    })
  }
  return tree;
}

const elements = [];
// const rootElements = [].slice.call(document.querySelectorAll('app-root > *'));
const rootElements = [].slice.call(document.querySelectorAll('app-root > * > *'));
rootElements.forEach(element => {
  elements.push(traverse(element))
});

window.localStorage.setItem('tree', JSON.stringify({
  pageUrl: window.location.pathname.substr(1),
  pageTitle: document.title,
  elements
}));

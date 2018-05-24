function visitElement(element) {
  return {
    tagName: element.tagName,
    className: element.className.split(' ').join('\/'),
    boundingClientRect: element.getBoundingClientRect(),
    // styles: JSON.parse(JSON.stringify(getComputedStyle(element))), // Workaround Hack    
  }
}

function visitText(text) {
  return { text: text.textContent }
}

function traverse(node) {
  let tree = {}
  if (node instanceof Element) {
    tree = Object.assign(tree, visitElement(node));
  } else if (node instanceof Text) {
    tree = Object.assign(tree, visitText(node));
  }

  if(node.hasChildNodes()) {
    tree.children = [];
    [].slice.call(node.childNodes).forEach(node => {
      tree.children.push(traverse(node))
    })
  }
  return tree;
}

const elements = [];
const rootElements = [].slice.call(document.querySelectorAll('app-root > *'));
rootElements.forEach(element => {
  elements.push(traverse(element))
});

window.localStorage.setItem('tree', JSON.stringify({
  name: document.title, 
  elements
}));

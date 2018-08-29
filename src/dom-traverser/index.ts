import { AssetHelper } from './asset-helper';
import { DomVisitor } from './dom-visitor';
import { DomTraverser } from './dom-traverser';

declare var window: any;

const images = new AssetHelper();
const hostElement = document.querySelector(window.TRAVERSER_SELECTOR) as HTMLElement;
const visitor = new DomVisitor(hostElement);
const tree = new DomTraverser();

const element = tree.traverse(hostElement, visitor);

window.TREE = JSON.stringify({
  pageUrl: window.location.pathname.substr(1),
  pageTitle: document.title,
  assets: images.assets,
  element,
});

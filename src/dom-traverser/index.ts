import { DomTraverser } from './dom-traverser';
import { DomVisitor } from './dom-visitor';
import { AssetHelper } from './asset-helper';

declare const window: any;

window.AssetHelper = AssetHelper;
window.DomTraverser = DomTraverser;
window.DomVisitor = DomVisitor;

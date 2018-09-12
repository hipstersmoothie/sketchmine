import { TraversedLibrary, TraversedPage } from 'dom-traverser/traversed-dom';
import { AssetHelper } from 'dom-traverser/asset-helper';
import { DomTraverser } from 'dom-traverser/dom-traverser';
import { DomVisitor } from 'dom-traverser/dom-visitor';

// Type definitions for sketch-library
// Project: sketch-generator-api
// Definitions by: Lukas Holzer <lukas.holzer@dynatrace.com>

declare global {
  interface Window {
    sketchGenerator: SketchGenerator;
    page?: TraversedPage;
    library?: TraversedLibrary;
    AssetHelper: AssetHelper,
    DomTraverser: DomTraverser,
    DomVisitor: DomVisitor,
    _handleClick: (fn: (...args: any[]) => void, ...args: any[]) => Promise<{}>;
    _handleHover: (fn: (...args: any[]) => void, ...args: any[]) => Promise<{}>;
    _handleFocus: (fn: (...args: any[]) => void, ...args: any[]) => Promise<{}>;
    _draw: (fn: (...args: any[]) => void, ...args: any[]) => Promise<{}>;
    _finish: (fn: (...args: any[]) => void) => Promise<{}>;
  }
}

export interface SketchGenerator {
  emitHover: (selector: string) => Promise<{}>;
  emitClick: (selector: string) => Promise<{}>;
  emitFocus: (selector: string) => Promise<{}>;
  emitDraw: (symbolName: string) => Promise<{}>;
  emitFinish: () => Promise<{}>;
  _resolvePending: (cbId: number) => void;
}

export { };

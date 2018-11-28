import {
  TraversedLibrary,
  TraversedPage,
  AssetHelper,
  DomTraverser,
  DomVisitor,
} from '@sketchmine/dom-agent';

export interface InjectedWindow extends Window {
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

export interface SketchGenerator {
  emitHover: (selector: string) => Promise<{}>;
  emitClick: (selector: string) => Promise<{}>;
  emitFocus: (selector: string) => Promise<{}>;
  emitDraw: (symbolName: string) => Promise<{}>;
  emitFinish: () => Promise<{}>;
  _resolvePending: (cbId: number) => void;
}

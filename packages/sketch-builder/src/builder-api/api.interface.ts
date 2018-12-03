import {
  TraversedLibrary,
  TraversedPage,
  Traverser,
  Visitor,
} from '@sketchmine/dom-agent/lib/@types/public-api';

export type Constructor<T> = new(...args: any[]) => T;
export interface InjectedWindow extends Window {
  sketchGenerator: SketchGenerator;
  page?: TraversedPage;
  library?: TraversedLibrary;
  AssetHelper: Constructor<any>;
  DomTraverser: Constructor<Traverser>;
  DomVisitor: Constructor<Visitor>;
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

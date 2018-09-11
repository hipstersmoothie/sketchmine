import { ITraversedElement } from "dom-traverser/traversed-dom";

// Type definitions for sketch-library
// Project: sketch-generator-api
// Definitions by: Lukas Holzer <lukas.holzer@dynatrace.com>

declare global {
  interface Window {
    sketchGenerator: SketchGenerator;
    variants: ITraversedElement[];
    _handleClick: (fn: (...args: any[]) => void, ...args: any[]) => Promise<{}>;
    _handleHover: (fn: (...args: any[]) => void, ...args: any[]) => Promise<{}>;
    _handleFocus: (fn: (...args: any[]) => void, ...args: any[]) => Promise<{}>;
    _finish: (fn: (...args: any[]) => void) => Promise<{}>;
    _draw: (fn: (...args: any[]) => void) => Promise<{}>;
  }
}

export interface SketchGenerator {
  emitHover: (selector: string) => Promise<{}>;
  emitClick: (selector: string) => Promise<{}>;
  emitFocus: (selector: string) => Promise<{}>;
  emitFinish: () => Promise<{}>;
  emitDraw: () => Promise<{}>;
  _resolvePending: (cbId: number) => void;
}

export { };

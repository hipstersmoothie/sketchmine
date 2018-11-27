import { SketchObjectTypes } from './base.interface';

export interface SketchGraphicsContext {
  _class: SketchObjectTypes.GraphicsContext;
  blendMode: number;
  opacity: number;
}

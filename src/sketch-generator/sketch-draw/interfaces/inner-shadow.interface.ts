import { SketchObjectTypes } from './base.interface';
import { SketchColor } from './color.interface';
import { SketchGraphicsContext } from './graphics-context.interface';

export interface SketchInnerShadow {
  _class: SketchObjectTypes.InnerShadow;
  isEnabled: boolean;
  blurRadius: number;
  color: SketchColor;
  contextSettings: SketchGraphicsContext;
  offsetX: number;
  offsetY: number;
  spread: number;
}

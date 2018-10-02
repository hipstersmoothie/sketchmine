import { SketchGraphicsContext } from './graphics-context.interface';
import { SketchColor } from './color.interface';
import { SketchObjectTypes } from './base.interface';

export interface SketchShadow {
  _class: SketchObjectTypes.Shadow;
  isEnabled: boolean;
  color: SketchColor;
  contextSettings: SketchGraphicsContext;
  blurRadius: number;
  offsetX: number;
  offsetY: number;
  spread: number;
}

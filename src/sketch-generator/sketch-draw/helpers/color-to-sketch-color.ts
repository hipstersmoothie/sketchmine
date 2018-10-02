import { SketchColor, SketchObjectTypes } from '../interfaces';
import { cssToRGBA } from '.';

export function colorToSketchColor(color: string | any, alpha: number = 1): SketchColor {
  const { r, g, b, a } = cssToRGBA(color);

  return {
    _class: SketchObjectTypes.Color,
    red: r / 255,
    green: g / 255,
    blue: b / 255,
    alpha: a * alpha,
  };
}

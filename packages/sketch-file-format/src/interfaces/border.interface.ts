import { SketchColorBase } from './color.interface';

export interface SketchBorder extends SketchColorBase {
  position: number;
  thickness: number;
}

import { Rectangle, Style } from '@sketchmine/sketch-file-format';
import { SAMPLE_BOUNDING } from './bounding-fixtures';

export function generateRectangle(
  fillColor: string | any,
  borderColor: string | any,
  borderThickness: number = 1,
) {
  const style = new Style();
  style.addBorder(borderColor, borderThickness);
  style.addFill(fillColor);
  const rectangle = new Rectangle(SAMPLE_BOUNDING, 0).generateObject();
  rectangle.style = style.generateObject();
  return rectangle;
}

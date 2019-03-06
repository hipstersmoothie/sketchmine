import { Rectangle, Style } from '@sketchmine/sketch-file-format';

export function generateRectangle(
  fillColor: string | any,
  borderColor: string | any,
  borderThickness: number = 1,
) {
  const style = new Style();
  style.addBorder(borderColor, borderThickness);
  style.addFill(fillColor);
  const rectangle = new Rectangle({ x: 0, y: 0, width: 100, height: 100 }, 0).generateObject();
  rectangle.style = style.generateObject();
  return rectangle;
}

import { Artboard, colorToSketchColor } from '@sketchmine/sketch-file-format';
import { SketchArtboard } from '@sketchmine/sketch-file-format/src/interfaces';
import { generateRectangle } from './rectangle-fixtures';
import { VALID_TEXT_COLORS } from '../../src/config';

function getRandomValidColor(): string {
  return VALID_TEXT_COLORS[Math.floor(Math.random() * VALID_TEXT_COLORS.length)];
}

export function generateArtboard(size = 100, empty = false): SketchArtboard {
  const artboard = new Artboard({ x: 0, y: 0, width: size, height: 100 });
  artboard.name = `${size}-test-ab`;

  if (!empty) {
    // generate a rectangle with a valid border and fill color.
    const rect = generateRectangle(getRandomValidColor(), getRandomValidColor(), 1);
    artboard.addLayer(rect);
  }

  return artboard.generateObject();
}

export function generateArtboardWithEnabledBackgroundColor(size: number, color: string): SketchArtboard {
  const artboardObject = generateArtboard(size);
  artboardObject.backgroundColor = colorToSketchColor(color);
  artboardObject.hasBackgroundColor = true;
  artboardObject.includeBackgroundColorInExport = true;
  return artboardObject;
}

export function generateArtboardWithDisabledBackgroundColor(size: number, color: string): SketchArtboard {
  const artboardObject = generateArtboardWithEnabledBackgroundColor(size, color);
  artboardObject.includeBackgroundColorInExport = false;
  return artboardObject;
}

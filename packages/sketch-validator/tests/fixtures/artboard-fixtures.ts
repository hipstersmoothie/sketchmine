import {
  SAMPLE_BOUNDING,
  SAMPLE_360_BOUNDING,
  SAMPLE_1280_BOUNDING,
  SAMPLE_1920_BOUNDING,
} from './bounding-fixtures';
import { Artboard, colorToSketchColor } from '@sketchmine/sketch-file-format';
import { SketchArtboard } from '@sketchmine/sketch-file-format/src/interfaces';
import { generateRectangle } from './rectangle-fixtures';
import { VALID_TEXT_COLORS } from '../../src/config';

function getRandomValidColor(): string {
  return VALID_TEXT_COLORS[Math.floor(Math.random() * VALID_TEXT_COLORS.length)];
}

export function generateArtboard(size: number, empty: boolean = false): SketchArtboard {
  let artboard: Artboard;
  switch (size) {
    case 360:
      artboard = new Artboard(SAMPLE_360_BOUNDING);
      artboard.name = '360-test-ab';
      break;
    case 1280:
      artboard = new Artboard(SAMPLE_1280_BOUNDING);
      artboard.name = '1280-test-ab';
      break;
    case 1920:
      artboard = new Artboard(SAMPLE_1920_BOUNDING);
      artboard.name = '1920-test-ab';
      break;
    default:
      artboard = new Artboard(SAMPLE_BOUNDING);
      artboard.name = '100-test-ab';
      break;
  }

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

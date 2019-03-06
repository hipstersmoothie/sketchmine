import { StyleDeclaration } from '@sketchmine/helpers';
import {
  SketchColor,
  SketchEncodedAttributes,
  SketchObjectTypes,
  SketchPage,
  SketchText,
  Text,
} from '@sketchmine/sketch-file-format';
import { SketchAttribute } from '@sketchmine/sketch-file-format/src/interfaces';
import cloneDeep from 'lodash/cloneDeep';
import { generateValidSketchPages } from './page-fixtures';

/**
 * Generates a Sketch text layer with given properties.
 * @param color - text color.
 * @param fontSize - font size.
 * @param fontFamily - font family.
 * @param text - the text.
 */
function generateSketchTextLayer(color: string, fontSize: string, fontFamily: string, text: string): SketchText {
  // Generate style declaration
  const STYLE_DECLARATION = new StyleDeclaration();
  STYLE_DECLARATION.color = color;
  STYLE_DECLARATION.fontFamily = fontFamily;
  STYLE_DECLARATION.fontSize = fontSize;
  // Generate text
  const testString = new Text({ x: 0, y: 0, width: 100, height: 100 }, STYLE_DECLARATION);
  testString.text = text;
  return testString.generateObject();
}

/**
 * Generates pages and two text layers that are added to the first page.
 * The second text layer uses Bitstream Vera as font family.
 * @param pageIndex - Index of page where text should be added, default 0.
 * @param color - Text color, default #454646.
 * @param fontSize - Font size, default 14px.
 * @param fontFamily - Font family, default Bernina Sans Offc.
 * @param text - The text, default "Hello World!".
 */
export function getSketchPagesWithText(
  pageIndex = 0,
  color = '#454646',
  fontSize = '14px',
  fontFamily = 'Bernina Sans Offc',
  text = 'Hello World!',
): SketchPage[] {
  const validPagesBase: SketchPage[] = generateValidSketchPages(false); // no symbols page needed
  const textLayerBerninaSansOffc = generateSketchTextLayer(color, fontSize, fontFamily, text);
  const textLayerBitstreamVera = generateSketchTextLayer(color, fontSize, 'Bitstream Vera', text);
  // Add text layer to first artboard of defined page.
  validPagesBase[pageIndex].layers[0].layers.push(textLayerBerninaSansOffc);
  validPagesBase[pageIndex].layers[0].layers.push(textLayerBitstreamVera);
  return validPagesBase;
}

/**
 * Generates Sketch pages and adds text layers that don't have a color attribute set at all.
 */
export function getSketchPagesWithTextWithoutColor(): SketchPage[] {
  const validPagesBase: SketchPage[] = generateValidSketchPages(false); // no symbols page needed
  const textLayer = generateSketchTextLayer('#454646', '14px', 'Bernina Sans Offc', 'Hello World!');
  textLayer.attributedString.attributes.forEach((attr) => {
    if (attr._class === SketchObjectTypes.StringAttribute) {
      delete attr.attributes.MSAttributedStringColorAttribute;
    }
  });
  // Add text layer to first artboard of first page.
  validPagesBase[0].layers[0].layers.push(textLayer);
  return validPagesBase;
}

/**
 * Generates Sketch pages that contains text that has been partly modified.
 * When a number is given part of the text size will be modified.
 * When a SketchColor is given part of the text color will be modified.
 * @param modification - The modification that should be done.
 */
export function getSketchPagesWithModifiedTextLayer(modification: SketchColor | number): SketchPage[] {
  const validPagesBase: SketchPage[] = generateValidSketchPages(false); // no symbols page needed
  const textLayer = generateSketchTextLayer('#454646', '14px', 'Bernina Sans Offc', 'Hello World!');

  // clone the string attribute...
  const stringAttributeCopy = cloneDeep(textLayer.attributedString.attributes[0].attributes) as SketchEncodedAttributes;
  if (typeof modification === 'number') {
    // ... and change the font size to the given font size
    stringAttributeCopy.MSAttributedStringFontAttribute.attributes.size = modification;
  } else {
    // ... and change the color to the given color
    stringAttributeCopy.MSAttributedStringColorAttribute = modification;
  }

  // generate a new string attribute containing the modification
  const newStringAttribute = {
    _class: SketchObjectTypes.StringAttribute,
    location: 12,
    length: 7,
    attributes: stringAttributeCopy,
  } as SketchAttribute;

  // add this string attribute to the text layer's attributes
  // note that now the Sketch file JSON output isn't valid anymore because
  // the total length of the edited string does not match the location and length
  // parameters of the newly added string attribute.
  textLayer.attributedString.attributes.push(newStringAttribute);
  validPagesBase[0].layers[0].layers.push(textLayer);
  return validPagesBase;
}

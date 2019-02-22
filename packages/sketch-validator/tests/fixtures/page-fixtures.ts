import {
  Page,
  Artboard,
  Rectangle,
  SketchArtboard,
  SketchPage,
} from '@sketchmine/sketch-file-format';
import {
  SAMPLE_BOUNDING,
  SAMPLE_360_BOUNDING,
  SAMPLE_1280_BOUNDING,
  SAMPLE_1920_BOUNDING,
} from './bounding-fixtures';
import { generateArtboard } from './artboard-fixtures';

/**
 * Creates a valid fixture base, containing three pages with one artboard each
 * and an optional symbols page.
 * All page- and artboardnames are valid, every artboard contains one object.
 * @param {boolean} addSymbols – Whether to create a symbols page too. Default is true.
 */
export function generateValidSketchPages(addSymbols = true): SketchPage[] {
  // Create & name pages
  const page360 = new Page(SAMPLE_360_BOUNDING);
  const page1280 = new Page(SAMPLE_1280_BOUNDING);
  const page1920 = new Page(SAMPLE_1920_BOUNDING);
  page360.name = '360';
  page1280.name = '1280';
  page1920.name = '1920';

  // Add artboards to pages
  page360.addLayer(generateArtboard(360));
  page1280.addLayer(generateArtboard(1280));
  page1920.addLayer(generateArtboard(1920));

  // Create array of pages
  const validSketchPages = [
    page360.generateObject(),
    page1280.generateObject(),
    page1920.generateObject(),
  ];

  // Create and add symbols page
  if (addSymbols) {
    const pageSymbols = new Page(SAMPLE_BOUNDING);
    pageSymbols.name = 'Symbols';
    const abSymbols = new Artboard(SAMPLE_BOUNDING);
    abSymbols.name = 'SampleAB';
    const rect = new Rectangle(SAMPLE_BOUNDING, 0);
    abSymbols.addLayer(rect.generateObject());
    pageSymbols.addLayer(abSymbols.generateObject());
    validSketchPages.push(pageSymbols.generateObject());
  }

  return validSketchPages;
}

/**
 * Generates pages with given artboards. If no artboards are given, pages stay empty (invalid).
 * @param artboards - Array of generated artboards.
 */
export function generatePagesWithArtboards(artboards: { [key: string]: SketchArtboard } = {}): SketchPage[] {
  const page360 = new Page(SAMPLE_360_BOUNDING);
  const page1280 = new Page(SAMPLE_1280_BOUNDING);
  const page1920 = new Page(SAMPLE_1920_BOUNDING);
  const pageSymbols = new Page(SAMPLE_BOUNDING);
  page360.name = '360';
  page1280.name = '1280';
  page1920.name = '1920';
  pageSymbols.name = 'SymbolMaster';

  Object.keys(artboards).forEach((key) => {
    switch (key) {
      case '360':
        page360.addLayer(artboards[key]);
        break;
      case '1280':
        page1280.addLayer(artboards[key]);
        break;
      case '1920':
        page1920.addLayer(artboards[key]);
        break;
      default:
        break;
    }
  });

  return [
    page360.generateObject(),
    page1280.generateObject(),
    page1920.generateObject(),
    pageSymbols.generateObject(),
  ];
}

/**
 * Generates not all required pages, but only two of them.
 * Page 1920 is missing.
 */
export function generateNotAllRequiredPages(): SketchPage[] {
  const page1 = new Page(SAMPLE_360_BOUNDING);
  const page2 = new Page(SAMPLE_1280_BOUNDING);
  page1.name = '360';
  page2.name = '1280';

  page1.addLayer(generateArtboard(360));
  page2.addLayer(generateArtboard(1280));

  return [
    page1.generateObject(),
    page2.generateObject(),
  ];
}

/**
 * Generates pages, one of it has an invalid name.
 */
export function generatePagesWithWrongNames(): SketchPage[] {
  const page1 = new Page(SAMPLE_360_BOUNDING);
  const page2 = new Page(SAMPLE_1280_BOUNDING);
  const page3 = new Page(SAMPLE_1920_BOUNDING);
  const page4 = new Page(SAMPLE_BOUNDING);
  page1.name = '360';
  page2.name = '1280 - Blubber'; // invalid page name
  page3.name = '1920';
  page4.name = 'SymbolMaster';

  page1.addLayer(generateArtboard(360));
  page2.addLayer(generateArtboard(1280));
  page3.addLayer(generateArtboard(1920));
  page4.addLayer(generateArtboard(100));

  return [
    page1.generateObject(),
    page2.generateObject(),
    page3.generateObject(),
    page4.generateObject(),
  ];
}

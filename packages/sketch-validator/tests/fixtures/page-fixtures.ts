import {
  Page,
  SketchArtboard,
  SketchPage,
} from '@sketchmine/sketch-file-format';
import { generateArtboard } from './artboard-fixtures';

/**
 * Generates a page containing an artboard with given width.
 * @param width - Width of page.
 */
function generatePageWithArtboard(width = 100): SketchPage {
  const page = new Page({ x: 0, y: 0, width, height: 100 });
  page.name = `${width}`;
  page.addLayer(generateArtboard(width));
  return page.generateObject();
}

/**
 * Generates a page containing the given artboard.
 * If no artboard is passed the page stays empty (invalid).
 * @param width - Width of page.
 * @param artboard - Artboard that is added to the page.
 */
function generatePageWithGivenArtboard(width: number, artboard: SketchArtboard | undefined): SketchPage {
  const page = new Page({ x: 0, y: 0, width, height: 100 });
  page.name = `${width}`;
  if (artboard) {
    page.addLayer(artboard);
  }
  return page.generateObject();
}

/**
 * Generates a symbols page.
 */
function generateSymbolsPage(): SketchPage {
  const page = new Page({ x: 0, y: 0, width: 100, height: 100 });
  page.name = 'Symbols';
  page.addLayer(generateArtboard(100));
  return page.generateObject();
}

/**
 * Creates a valid fixture base, containing three pages with one artboard each
 * and an optional symbols page.
 * All page- and artboardnames are valid, every artboard contains one object.
 * @param {boolean} addSymbols – Whether to create a symbols page too. Default is true.
 */
export function generateValidSketchPages(addSymbols = true): SketchPage[] {
  const validSketchPages = [360, 1280, 1920].map((size) => {
    return generatePageWithArtboard(size);
  });

  // Create and add symbols page
  if (addSymbols) {
    validSketchPages.push(generateSymbolsPage());
  }

  return validSketchPages;
}

/**
 * Generates pages with given artboards. If no artboards are given, pages stay empty (invalid).
 * @param artboards - Array of generated artboards.
 */
export function generatePagesWithArtboards(artboards: { [key: number]: SketchArtboard } = {}): SketchPage[] {
  const sketchPages = [360, 1280, 1920].map((size) => {
    return generatePageWithGivenArtboard(size, artboards[size]);
  });
  sketchPages.push(generateSymbolsPage());
  return sketchPages;
}

/**
 * Generates not all required pages, but only two of them.
 * Page 1920 is missing.
 */
export function generateNotAllRequiredPages(): SketchPage[] {
  return [360, 1280].map((size) => {
    return generatePageWithArtboard(size);
  });
}

/**
 * Generates pages, one of it has an invalid name.
 */
export function generatePagesWithWrongNames(): SketchPage[] {
  const sketchPages = generateValidSketchPages();
  sketchPages[1].name = '1280 - Blubber'; // invalid page name
  return sketchPages;
}

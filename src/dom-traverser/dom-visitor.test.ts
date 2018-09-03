import { JSDOM } from 'jsdom';
import * as path from 'path';
import { readFileSync } from 'fs';
import { DomVisitor, StyleDeclaration } from './dom-visitor';
import {
  ITraversedDomElement,
  ITraversedDomTextNode,
  ITraversedDomImageNode,
  ITraversedDomSvgNode,
} from './traversed-dom';

const TEST_FILE = path.join(process.cwd(), 'tests', 'fixtures', 'test-page.html');
const ROOT_ELEMENT = 'app-root';

describe('DOM Visitor', () => {
  let dom: JSDOM;
  let document: Document;
  let hostElement: HTMLElement;
  let visitor: DomVisitor;

  const rect = {
    bottom: expect.any(Number),
    top: expect.any(Number),
    width: expect.any(Number),
    height: expect.any(Number),
    left: expect.any(Number),
    right: expect.any(Number),
  };

  beforeAll(() => {
    const html = readFileSync(TEST_FILE).toString();
    dom = new JSDOM(html);
    document = dom.window.document;
    hostElement = document.querySelector(ROOT_ELEMENT) as HTMLElement;
    visitor = new DomVisitor(hostElement);
    /**
     * mock the getStyle function in case of getComputedStyle(),
     * in case that it is not available in jsdom.
     * For that we would need an e2e test.
     */
    visitor.getStyle = jest.fn().mockReturnValue({
      styles: new StyleDeclaration(),
      isHidden: false,
      hasDefaultStyling: false,
    });
  });

  test('visiting hostElement <app-root>', () => {
    const result = visitor.visitElement(hostElement) as ITraversedDomElement;
    expect(result.tagName).toMatch(ROOT_ELEMENT.toUpperCase());
    expect(result.className).toHaveLength(0);
    expect(result.parentRect).toBeNull();
    expect(result.boundingClientRect).toEqual(expect.objectContaining(rect));
    expect(result).toHaveProperty('styles');
  });

  test('visiting button', () => {
    const button = document.querySelector('button');
    const result = visitor.visitElement(button) as ITraversedDomElement;
    expect(result.tagName).toBe('BUTTON');
    expect(result.className).toMatch(/dt-color-main/);
    expect(result.parentRect).toEqual(expect.objectContaining(rect));
    expect(result.boundingClientRect).toEqual(expect.objectContaining(rect));
    expect(result).toHaveProperty('styles');
  });

  test('visiting image node', () => {
    const img = document.querySelector('img');
    const result = visitor.visitElement(img) as ITraversedDomImageNode;
    expect(result).toHaveProperty('className');
    expect(result.tagName).toBe('IMG');
    expect(result.parentRect).toEqual(expect.objectContaining(rect));
    expect(result.boundingClientRect).toEqual(expect.objectContaining(rect));
    expect(result.src).toMatch(/images\/.*?\.(gif|jpg|jpeg|tiff|png)$/);
    expect(result.name).toMatch(/^(http|https):\/\//);
    expect(result).toHaveProperty('styles');
  });

  test('visiting svg node', () => {
    const svg = document.querySelector('svg');
    const result = visitor.visitElement(svg) as ITraversedDomSvgNode;
    expect(result).toHaveProperty('className');
    expect(result.tagName).toBe('SVG');
    expect(result).toHaveProperty('styles');
    expect(result.parentRect).toEqual(expect.objectContaining(rect));
    expect(result.boundingClientRect).toEqual(expect.objectContaining(rect));
    expect(result).toHaveProperty('html');
    expect(result.html).toMatch(/<svg[\S\s.]*?<\/svg>/);
  });

  test('visiting text node', () => {
    const text = document.querySelector('span').childNodes[0];
    const result = visitor.visitText(text) as ITraversedDomTextNode;
    expect(result).not.toHaveProperty('boundingClientRect');
    expect(result).not.toHaveProperty('className');
    expect(result.tagName).toBe('TEXT');
    expect(result.parentRect).toEqual(expect.objectContaining(rect));
    expect(result.text).toMatch('Primary Button');
    expect(result).toHaveProperty('styles');
  });

  test('has default styling', () => {
    visitor.getStyle = jest.fn().mockReturnValue({
      styles: new StyleDeclaration(),
      isHidden: false,
      hasDefaultStyling: true,
    });
    const button = document.querySelector('button');
    const result = visitor.visitElement(button) as ITraversedDomElement;
    expect(result).toHaveProperty('styles');
    expect(result.styles).toBe(null);
  });
});

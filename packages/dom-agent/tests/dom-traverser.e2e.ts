import puppeteer from 'puppeteer';
import { ITraversedElement } from '../src/typings';
import { readFile } from '@sketchmine/node-helpers';
import { resolve, join } from 'path';

declare var window: any;

const TEST_FILE = `file:${join(process.cwd(), 'tests', 'fixtures', 'tile-default.html')}`;
const DOM_AGENT = resolve('lib', 'index.esm.js');
const ROOT_ELEMENT = 'app-root > * ';

function findObjects(o: Object, targetProp: string, targetValue: any, finalResults) {
  function getObject(obj: Object) {
    if (obj instanceof Array) {
      for (let i = 0, max = obj.length; i < max; i += 1) {
        getObject(obj[i]);
      }
    } else {
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (obj[prop] === targetValue) {
            finalResults.push(obj);
          }
          if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
            getObject(obj[prop]);
          }
        }
      }
    }
  }
  getObject(o);
}

describe('E2E Dom Traverser', () => {
  let browser: puppeteer.Browser;
  let result;

  beforeAll(async () => {
    const options = { headless: true, devtools: false };
    const domAgent = await readFile(DOM_AGENT);
    browser = await puppeteer.launch(options);

    const page = await browser.newPage();
    await page.goto(TEST_FILE, { waitUntil: 'networkidle2' });
    // await page.evaluateOnNewDocument(traverser);
    await page.addScriptTag({ content: domAgent });
    await page.addScriptTag({ content: `
        const hostElement = document.querySelector('${ROOT_ELEMENT}');
        const visitor = new DomVisitor(hostElement, []);
        const traverser = new DomTraverser();
        const images = new AssetHelper();
        window.page = {
          type: 'page',
          pageUrl: window.location.pathname.substr(1),
          pageTitle: document.title,
          assets: images.assets,
          element: traverser.traverse(hostElement, visitor),
        };
    ` });

    result = await page.evaluate(() => window.page) as ITraversedElement[];
  });

  test('traversed result has structure of traversed page', () => {
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('pageUrl');
    expect(result).toHaveProperty('pageTitle');
    expect(result).toHaveProperty('assets');
    expect(result).toHaveProperty('element');
    expect(result.element).toBeInstanceOf(Object);
    expect(result.assets).toBeInstanceOf(Array);
  });

  test('first child to be dt-tile', () => {
    expect(result.element.tagName).toBe('APP-TILE-DEFAULT');
    expect(result.element.parentRect).toBeNull();
    expect(result.element.boundingClientRect).toMatchObject(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        top: expect.any(Number),
        right: expect.any(Number),
        left: expect.any(Number),
        bottom: expect.any(Number),
        width: expect.any(Number),
        height: expect.any(Number),
      }),
    );
  });

  test('get tile headline', () => {
    const r = [];
    findObjects(result, 'tagName', 'TEXT', r);
    const tileHeadline = r[0];
    expect(tileHeadline.text).toMatch('L-W8-64-APMDay3');
    expect(tileHeadline.styles).toHaveProperty('fontFamily');
    expect(tileHeadline.styles).toHaveProperty('fontSize');
    expect(tileHeadline.styles).toHaveProperty('fontWeight');
    expect(tileHeadline.styles).toHaveProperty('color');
    expect(tileHeadline.styles.fontFamily).toMatch('BerninaSansWeb, "Open Sans", sans-serif');
    expect(tileHeadline.styles.fontSize).toMatch('16px');
    expect(tileHeadline.styles.color).toMatch('rgb(69, 70, 70)');
  });

  test('get icon background style', () => {
    const r = [];
    findObjects(result, 'tagName', 'dt-tile-icon', r);
    const icon = r[0];
    expect(icon.styles.padding).toMatch('0px');
    expect(icon.styles.backgroundColor).toMatch('rgb(69, 70, 70)');
    expect(icon.styles.display).toMatch('flex');
  });

  test('get svg style', () => {
    const r = [];
    findObjects(result, 'tagName', 'SVG', r);
    const svg = r[0];
    expect(svg).toHaveProperty('html');
    expect(svg.html).toMatch(/<svg[\S\s.]*?<\/svg>/);
    expect(svg.styles.fill).toMatch('rgb(255, 255, 255)');
  });

  afterAll(async () => {
    await browser.close();
  });

});

import * as path from 'path';
import * as puppeteer from 'puppeteer';

const config = require(`${process.cwd()}/config/app.json`);
const TEST_FILE = `file:${path.join(process.cwd(), 'tests', 'fixtures', 'tile-default.html')}`;
const TRAVERSER = path.join(process.cwd(), config.sketchGenerator.traverser);
const ROOT_ELEMENT = 'app-root > * > *';

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
    browser = await puppeteer.launch(options);

    const page = await browser.newPage();
    await page.goto(TEST_FILE, { waitUntil: 'networkidle0' });

    await page.addScriptTag({ content: `window.TRAVERSER_SELECTOR = '${ROOT_ELEMENT}';` });
    await page.addScriptTag({ path: TRAVERSER });
    result = await page.evaluate(() => JSON.parse((window as any).TREE));
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
    expect(result.element.tagName).toBe('DT-TILE');
    expect(result.element.className).toMatch('dt-tile');
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

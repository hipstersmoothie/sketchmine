import * as path from 'path';
import chalk from 'chalk';
import puppeteer from 'puppeteer';
import { Sketch } from '@sketch-draw/sketch';
import { Drawer } from './drawer';
import { ITraversedElement, TraversedLibrary, TraversedPage } from '../dom-traverser/traversed-dom';
import { exec } from 'child_process';
import { SketchGenerator } from './sketch-generator';
import { readFile, Logger } from '@utils';
import { sketchGeneratorApi } from './sketch-generator-api';
import { AMP } from '../angular-meta-parser/meta-information';

const log = new Logger();
const config = require(`${process.cwd()}/config/app.json`);
const TRAVERSER = path.join(process.cwd(), config.sketchGenerator.traverser);

/**
 * For debugging reasons the result of the dom Traverser can be stored in a file,
 * then the traversing in the browser gets skiped and uses the result from the json.
 */
const LOCAL_RESULT_PATH = 'tests/fixtures/library.json';

export class ElementFetcher {
  // private _assetHsandler: AssetHandler = new AssetHandler();
  private _result: (TraversedPage | TraversedLibrary)[] = [];

  constructor(public conf: SketchGenerator.Config, public meta?: AMP.Result) { }

  async generateSketchFile(): Promise<number> {
    const drawer = new Drawer();
    const sketch = new Sketch(this.conf.outFile);
    const pages = [];
    let symbolsMaster = drawer.drawSymbols({ symbols: [] } as any);

    if (this._result.length > 0) {
      this._result.forEach((result) => {
        switch (result.type) {
          case 'page':
            pages.push(drawer.drawPage(result));
            break;
          case 'library':
            symbolsMaster = drawer.drawSymbols(this._result[0] as TraversedLibrary);
            break;
        }
      });
    }
    // TODO: add asset handler
    // if (this.hasAssets()) {
    //   sketch.prepareFolders();
    //   await this.downloadAssets();
    // }
    await sketch.write([symbolsMaster, ...pages]);
    sketch.cleanup();

    if (process.env.SKETCH === 'open-close') {
      exec(`open ${this.conf.outFile}`);
    }
    return 0;
  }

  /**
   * Checks if there are assets in the symbols
   * @returns boolean
   */
  // private hasAssets(): boolean {
  //   return this._result.some(res => res.some(symbol => Object.keys(symbol.assets).length > 0));
  // }

  /**
   * Download all Assets for all pages to the folder
   */
  // private async downloadAssets() {
  //   this._assetHandler.clean();
  //   if (process.env.DEBUG) {
  //     console.log(chalk`\n📷\t{blueBright Downloading images}:`);
  //   }
  //   const assets = this._symbols.map(symbol => this._assetHandler.download(symbol.assets));
  //   await Promise.all(assets);
  // }

  async getPage(browser: puppeteer.Browser, url: string): Promise<TraversedPage | TraversedLibrary> {
    const traverser = await readFile(TRAVERSER);
    let result: any;

    if (this.conf.library) {
      result = await sketchGeneratorApi({
        browser,
        url,
        rootSelector: this.conf.rootElement,
        traverser,
        metaInformation: this.meta,
      });
    } else {
      const page = await browser.newPage();
      page.setViewport(this.conf.chrome.defaultViewport);
      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.addScriptTag({ content: traverser });
      await page.addScriptTag({ content: `
          const images = new AssetHelper();
          window.page = {
            type: 'page',
            pageUrl: window.location.pathname.substr(1),
            pageTitle: document.title,
            assets: images.assets,
            element: null,
          };
          const hostElement = document.querySelector('${this.conf.rootElement}');
          if (!hostElement) {
            throw new Error(\`Could not select hostElement with selector: ${this.conf.rootElement}\`);
          }
          const visitor = new DomVisitor(hostElement, []);
          const traverser = new DomTraverser();
          window.page.element = traverser.traverse(hostElement, visitor);` });
      result = await page.evaluate(() => window.page) as ITraversedElement[];
    }
    log.debug(JSON.stringify(result), 'dom-traverser');
    return result;
  }

  async collectElements() {
    if (process.env.TRAVERSER.includes('skip-traverser')) {
      const result = JSON.parse(await readFile(LOCAL_RESULT_PATH));
      this._result.push(result);
      return;
    }

    const options = process.env.DOCKER ?  {
      ...this.conf.chrome,
      /**
       * shared memory space 64MB. Cause chrome to crash when rendering large pages
       * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#tips
       */
      args: ['--disable-dev-shm-usage', '--no-sandbox'],
      executablePath: '/usr/bin/chromium-browser',
    } : {
      ...this.conf.chrome,
      headless: process.env.DEBUG ? false : true,
      devtools: process.env.DEBUG ? true : false,
    };
    const browser = await puppeteer.launch(options);
    const confPages = this.conf.pages || [''];

    for (let i = 0, max = confPages.length; i < max; i += 1) {
      const page = confPages[i];

      const host = this.conf.host;

      const port = (host.port && host.protocol.match(/^https?/)) ?
        `:${host.port}` : '';

      const url = `${host.protocol}://${host.name}${port}/${page}`;

      log.debug(chalk`🛬\t{cyanBright Fetching Page}: ${url}`);
      this._result.push(await this.getPage(browser, url));
    }

    // await browser.close();
  }
}

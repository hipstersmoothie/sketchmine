import * as path from 'path';
import chalk from 'chalk';
import * as puppeteer from 'puppeteer';
import { Sketch } from '@sketch-draw/sketch';
import { Drawer } from './drawer';
import { ITraversedDom, ITraversedElement } from '../dom-traverser/traversed-dom';
import { AssetHandler } from '@sketch-draw/asset-handler';
import { exec } from 'child_process';
import { SG } from './index.d';
import { readFile } from '@utils';
import { sketchGeneratorApi } from './sketch-generator-api';
import { AssetHelper } from '../dom-traverser/asset-helper';
import { DomVisitor } from '../dom-traverser/dom-visitor';
import { DomTraverser } from '../dom-traverser/dom-traverser';

const config = require(`${process.cwd()}/config/app.json`);
const TRAVERSER = path.join(process.cwd(), config.sketchGenerator.traverser);

export class ElementFetcher {
  private _assetHandler: AssetHandler = new AssetHandler();
  private _symbols: ITraversedDom[] = [];
  private _injectedDomTraverser =  path.join(process.cwd(), config.sketchGenerator.traverser);

  constructor(public conf: SG.Config) { }

  async generateSketchFile(pages: string[], outDir?: string): Promise<number> {
    const drawer = new Drawer();
    const sketch = new Sketch(outDir);
    await this.collectElements(pages);
    if (this.assets()) {
      sketch.prepareFolders();
      await this.downloadAssets();
    }
    const symbolsMaster = drawer.drawSymbols(this._symbols);
    await sketch.write([symbolsMaster]);
    sketch.cleanup();

    if (process.env.SKETCH === 'open-close') {
      exec('open dt-asset-lib.sketch');
    }
    return Promise.resolve(0);
  }

  /**
   * Checks if there are assets in the symbols
   * @returns boolean
   */
  private assets(): boolean {
    return this._symbols.some(symbol => Object.keys(symbol.assets).length > 0);
  }

  /**
   * Download all Assets for all pages to the folder
   */
  private async downloadAssets() {
    this._assetHandler.clean();
    if (process.env.DEBUG) {
      console.log(chalk`\n📷\t{blueBright Downloading images}:`);
    }
    const assets = this._symbols.map(symbol => this._assetHandler.download(symbol.assets));
    await Promise.all(assets);
  }

  async getPage(browser: puppeteer.Browser, url: string): Promise<ITraversedDom> {

    const traverser = await readFile(TRAVERSER);
    let result: any;

    if (this.conf.args.api) {
      result = await sketchGeneratorApi(browser, url, this.conf.args.rootElement, traverser);
    } else {
      const page = await browser.newPage();
      await page.evaluateOnNewDocument(traverser);
      await page.evaluateOnNewDocument(
        (rootElement: string) => {
          const images = new AssetHelper();
          window.variants = [];
          const hostElement = document.querySelector(rootElement) as HTMLElement;
          const visitor = new DomVisitor(hostElement);
          const traverser = new DomTraverser();
          window.variants.push(traverser.traverse(hostElement, visitor));
        },
        this.conf.args.rootElement);

      await page.goto(url, { waitUntil: 'networkidle2' });
      result = await page.evaluate(() => window.variants) as ITraversedElement[];
    }
    console.log(result);
    // TODO: write new Result from traversed DOM for sketch
    return Promise.resolve(null);
  }

  private async collectElements(pages: string[]) {
    // const options = (process.env.DEBUG_BROWSER) ?
    //   { headless: false, devtools: true } : { headless: true, devtools: false };
    // const browser = await puppeteer.launch(options);
    // try {
    //   for (let i = 0, max = pages.length; i < max; i += 1) {
    //     const url = `${ElementFetcher._host}${pages[i]}`;
    //     if (process.env.DEBUG) {
    //       console.log(chalk`🛬\t{cyanBright Fetching Page}: ${url}`);
    //     }
    //     this._symbols.push(await this.getPage(browser, url));
    //   }
    // } catch (error) {
    //   throw Error(chalk`\n\n🚨 {bgRed Something happened while launching the headless browser:} 🌍 🖥\n${error}`);
    // }
    // if (process.env.DEBUG_BROWSER === 'no-close') {
    //   await browser.close();
    // }
  }
}

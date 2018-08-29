import * as path from 'path';
import chalk from 'chalk';
import * as puppeteer from 'puppeteer';
import { Sketch } from '@sketch-draw/sketch';
import { Drawer } from './drawer';
import { ITraversedDom } from '../dom-traverser/traversed-dom';
import { AssetHandler } from '@sketch-draw/asset-handler';
import { exec } from 'child_process';

export class ElementFetcher {

  private static HOST = 'http://localhost:4200';
  private static SELECTOR = 'app-root > * > *';
  private _assetHandler: AssetHandler = new AssetHandler();
  private _symbols: ITraversedDom[] = [];
  private _injectedDomTraverser = path.resolve(__dirname, '../dom-traverser/index.js');

  set host(host: string) { ElementFetcher.HOST = host; }
  set selector(sel: string) { ElementFetcher.SELECTOR = sel; }

  async generateSketchFile(pages: string[], outDir?: string): Promise<boolean> {
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
    return Promise.resolve(true);
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

  private async getPage(browser: puppeteer.Browser, url: string): Promise<ITraversedDom> {
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle0' });

      await page.addScriptTag({
        content: `window.TRAVERSER_SELECTOR = '${ElementFetcher.SELECTOR}';`,
      });
      await page.addScriptTag({
        path: this._injectedDomTraverser,
      });
      return await page.evaluate(() => JSON.parse((window as any).TREE));
    } catch (error) {
      throw Error(chalk`\n\n🚨 {bgRed Something happened while traversing the DOM:} 🚧\n${error}`);
    }
  }

  private async collectElements(pages: string[]) {
    const options = (process.env.DEBUG_BROWSER) ?
      { headless: false, devtools: true } : { headless: true, devtools: false };
    const browser = await puppeteer.launch(options);
    try {
      for (let i = 0, max = pages.length; i < max; i += 1) {
        const url = `${ElementFetcher.HOST}${pages[i]}`;
        if (process.env.DEBUG) {
          console.log(chalk`🛬\t{cyanBright Fetching Page}: ${url}`);
        }
        this._symbols.push(await this.getPage(browser, url));
      }
    } catch (error) {
      throw Error(chalk`\n\n🚨 {bgRed Something happened while launching the headless browser:} 🌍 🖥\n${error}`);
    }
    if (process.env.DEBUG_BROWSER === 'no-close') {
      await browser.close();
    }
  }
}

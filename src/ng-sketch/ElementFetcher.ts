import * as path from 'path';
import chalk from 'chalk';
import * as puppeteer from 'puppeteer';
import { SymbolMaster } from './sketchJSON/models/SymbolMaster';
import { ElementNode } from './ElementNode';
import { Page } from './sketchJSON/models/Page';
import { Sketch } from './sketchJSON/Sketch';
import { IGroup } from './sketchJSON/interfaces/Group';
import { Group } from './sketchJSON/models/Group';
import { Drawer } from './Drawer';
import { ITraversedDom } from './ITraversedDom';

export class ElementFetcher {

  private static _host = 'http://localhost:4200';
  private _symbols: ITraversedDom[] = [];
  private _injectedDomTraverser = path.resolve(__dirname, 'injectedTraverser.js');

  async generateSketch(pages: string[]) {
    await this.collectElements(pages);
    const drawer = new Drawer();    
    const sketch = new Sketch();
    const symbolsMaster = drawer.drawSymbols(this._symbols);

    sketch.write([symbolsMaster]);
  }

  private async getPage(browser: puppeteer.Browser, url: string): Promise<ITraversedDom>{
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle0' });

      await page.addScriptTag({
        path: this._injectedDomTraverser
      });

      return await page.evaluate(()=> { return JSON.parse(window.localStorage.tree) });
    } catch(error) {
      throw new Error(chalk`\n\n🚨 {bgRed Something happened while traversing the DOM:} 🚧\n${error}`);
    }
  }

  private async collectElements(pages: string[]) {
    const options = (process.env.DEBUG_BROWSER)? {headless: false, devtools: true}: {headless: true, devtools: false};
    const browser = await puppeteer.launch(options);
    try {
      for (let i = 0, max = pages.length; i < max; i++) {
        const url = `${ElementFetcher._host}${pages[i]}`;
        if (process.env.DEBUG) {
          console.log(chalk`🛬 {cyanBright Fetching Page}: ${url}`);
        }
        this._symbols.push(await this.getPage(browser, url));
      }    
    } catch(error) {
      throw new Error(chalk`\n\n🚨 {bgRed Something happened while launching the headless browser:} 🌍 🖥\n${error}`);
    }
    await browser.close();
  }
}

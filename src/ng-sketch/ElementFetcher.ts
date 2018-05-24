import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { SymbolMaster } from './sketchJSON/models/SymbolMaster';
import { IBounding } from './sketchJSON/interfaces/Base';
import { ElementNode } from './ElementNode';
import { IShapeGroup } from './sketchJSON/interfaces/ShapeGroup';
import { Page } from './sketchJSON/models/Page';
import { Sketch } from './sketchJSON/Sketch';
import { IGroup } from './sketchJSON/interfaces/Group';
import { Group } from './sketchJSON/models/Group';
import { Drawer } from './Drawer';
import { ITraversedDom } from './TraversedDom';

export class ElementFetcher {

  private static _host = 'http://localhost:4200';
  private _pages = ['/', '/'];
  private _symbols: ITraversedDom[] = [];
  private _injectedDomTraverser = path.resolve(__dirname, 'injectedTraverser.js');

  async generateSketch() {
    await this.collectElements();
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
      throw new Error(`Something happened while traversing the DOM: \n${error}`);
    }
  }

  private async collectElements() {
    const browser = await puppeteer.launch({headless: true, devtools: false});
    try {
      for (let i = 0, max = this._pages.length; i < max; i++) {
        const url = `${ElementFetcher._host}${this._pages[i]}`;
        console.log(`Fetching Page: ${url}`);
        this._symbols.push(await this.getPage(browser, url));
      }    
    } catch(error) {
      throw new Error(`Something happened while launching the headless browser: \n${error}`);
    }
    await browser.close();
  }
}

new ElementFetcher().generateSketch();

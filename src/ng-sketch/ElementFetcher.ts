import path from 'path';
import * as puppeteer from 'puppeteer';
import { SymbolMaster } from './sketchJSON/models/SymbolMaster';
import { IBounding } from './sketchJSON/interfaces/Base';
import { ElementNode } from './ElementNode';
import { IShapeGroup } from './sketchJSON/interfaces/ShapeGroup';
import { Page } from './sketchJSON/models/Page';
import { Sketch } from './sketchJSON/Sketch';


export interface IElement {
  tagName: string;
  name: string;
  boundingClientRect: ClientRect | DOMRect;
  style: CSSStyleDeclaration;
}

export class ElementFetcher {

  private static _host = 'http://localhost:4200';
  private _pages = ['/'];
  private _page: puppeteer.Page;
  private _elements = [];

  async generateSketch() {

    await this.collectElements();
    const size: IBounding = {height: 100, width: 100, x: 0, y: 0};

    const page = new Page(size);

    this._elements.forEach((el: IElement) => {

      const symbol = new SymbolMaster(size);
      symbol.name = el.name;

      new ElementNode(el).layers.forEach((layer: IShapeGroup) => {
        symbol.addLayer(layer);
      });
    
      page.addLayer(symbol.generateObject());
    });

    const sketch = new Sketch()
    sketch.write([page]);
  }


  private async collectElements() {
    const browser = await puppeteer.launch();
    this._page = await browser.newPage();

    try {
      await this._page.goto(`http://localhost:4200/`, { waitUntil: 'load' });

      const element = await this._page.evaluate(() => {
        const el = document.querySelector('app-root > *') as HTMLElement;
        return {
          tagName: el.tagName,
          name: el.className.split(' ').join('\/'),
          boundingClientRect: el.getBoundingClientRect(),
          style: JSON.parse(JSON.stringify(getComputedStyle(el) )) // Workaround Hack       
        } as IElement;
      });
      this._elements.push(element);
    } catch(error) {
      console.error(`Something happened navigating to the pages: \n${error}`);
    }

    await browser.close();
  }
}

new ElementFetcher().generateSketch();

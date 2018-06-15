import { Page } from './sketchJSON/models/page';
import { IBounding } from './sketchJSON/interfaces/base.interface';
import { SymbolMaster } from './sketchJSON/models/symbol-master';
import { ITraversedDom, ITraversedDomElement } from './traversed-dom.interface';
import { boundingClientRectToBounding } from './sketchJSON/helpers/util';
import { ElementNode } from './element-node';
import chalk from 'chalk';

export class Drawer {
  private static MARGIN = 40;
  private _lastSymbol: IBounding;

  drawSymbols(symbols: ITraversedDom[]): Page {
    const page = new Page(this.getPageSize(symbols));
    symbols.forEach((symbol) => {
      if (process.env.DEBUG) {
        console.log(chalk`\n💎\t{greenBright Draw new Symbol}: ${symbol.pageTitle} – ${symbol.pageUrl}`);
      }
      const symbolSize = this.getSymbolSize(symbol);
      const symbolMaster = new SymbolMaster(symbolSize);
      symbolMaster.name = symbol.pageUrl;

      if (symbol.element) {
        symbolMaster.layers = this.drawElements(symbol.element);
      }

      page.addLayer(symbolMaster.generateObject());
    });
    return page;
  }

  private drawElements(element: ITraversedDomElement) {
    const node = new ElementNode(element);
    return [...node.layers];
  }

  private getSymbolSize(symbol: ITraversedDom): IBounding {
    const element = symbol.element;
    const bcr = boundingClientRectToBounding(element.boundingClientRect);
    if (!this._lastSymbol) {
      this._lastSymbol = bcr;
      return bcr;
    }
    bcr.x += Drawer.MARGIN + this._lastSymbol.x + this._lastSymbol.width;
    this._lastSymbol = bcr;
    return bcr;
  }

  private getPageSize(pages: ITraversedDom[]): IBounding {
    const size: IBounding = { height: 0, width: 0, x: 0, y: 0 };
    for (let i = 0, max = pages.length; i < max; i += 1) {
      const margin = (i > 0) ? Drawer.MARGIN : 0;
      const bcr = boundingClientRectToBounding(pages[i].element.boundingClientRect);
      size.height += bcr.height + margin;
      size.width += bcr.width;
    }
    return size;
  }
}

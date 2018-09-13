import { Page } from '@sketch-draw/models/page';
import { IBounding } from '@sketch-draw/interfaces';
import { SymbolMaster } from '@sketch-draw/models/symbol-master';
import { ITraversedDomElement, TraversedLibrary, TraversedSymbol } from '../dom-traverser/traversed-dom';
import { boundingClientRectToBounding } from '@sketch-draw/helpers/util';
import { ElementDrawer } from './element-drawer';
import chalk from 'chalk';

export class Drawer {
  private static MARGIN = 40;
  private _lastSymbol: IBounding;

  drawSymbols(library: TraversedLibrary): Page {
    const symbols = library.symbols as TraversedSymbol[];
    const page = new Page(this.getPageSize(symbols));
    symbols.forEach((symbol) => {
      if (process.env.DEBUG) {
        console.log(chalk`\n💎\t{greenBright Draw new Symbol in library}: ${symbol.name}`);
      }
      const symbolSize = this.getSymbolSize(symbol);
      const symbolMaster = new SymbolMaster(symbolSize);
      symbolMaster.name = symbol.name;

      if (symbol.symbol) {
        symbolMaster.layers = this.drawElements(symbol.symbol);
      }

      page.addLayer(symbolMaster.generateObject());
    });
    return page;
  }

  private drawElements(element: ITraversedDomElement) {
    const node = new ElementDrawer(element);
    return [...node.layers];
  }

  private getSymbolSize(symbol: TraversedSymbol): IBounding {
    const element = symbol.symbol;
    const bcr = boundingClientRectToBounding(element.boundingClientRect);
    if (!this._lastSymbol) {
      this._lastSymbol = bcr;
      return bcr;
    }
    bcr.x += Drawer.MARGIN + this._lastSymbol.x + this._lastSymbol.width;
    this._lastSymbol = bcr;
    return bcr;
  }

  private getPageSize(pages: TraversedSymbol[]): IBounding {
    const size: IBounding = { height: 0, width: 0, x: 0, y: 0 };
    for (let i = 0, max = pages.length; i < max; i += 1) {
      const margin = (i > 0) ? Drawer.MARGIN : 0;
      const bcr = boundingClientRectToBounding(pages[i].symbol.boundingClientRect);
      size.height += bcr.height + margin;
      size.width += bcr.width;
    }
    return size;
  }
}

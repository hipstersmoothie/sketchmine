import { Page } from '@sketch-draw/models/page';
import { IBounding } from '@sketch-draw/interfaces';
import { SymbolMaster } from '@sketch-draw/models/symbol-master';
import { ITraversedDomElement, TraversedLibrary, TraversedSymbol, TraversedPage } from '../dom-traverser/traversed-dom';
import { boundingClientRectToBounding } from '@sketch-draw/helpers/util';
import { ElementDrawer } from './element-drawer';
import chalk from 'chalk';
import { Artboard } from '@sketch-draw/models/artboard';

interface LastSymbol extends IBounding {
  name: string;
}

export class Drawer {
  private static MARGIN = 40;
  private _lastSymbol: LastSymbol = { name: '/', x: 0, y: 0, height: 0, width: 0 };

  drawSymbols(library: TraversedLibrary): Page {
    const symbols = library.symbols as TraversedSymbol[];
    const page = new Page(this.getPageSize(symbols));
    for (let i = 0, max = symbols.length; i < max; i += 1) {
      const symbol = symbols[i];

      if (process.env.DEBUG) {
        console.log(chalk`\n💎\t{greenBright Draw new Symbol in library}: ${symbol.name}`);
      }

      const symbolSize = this.getSymbolSize(symbols, i);
      const symbolMaster = new SymbolMaster(symbolSize);
      symbolMaster.name = symbol.name;

      if (symbol.symbol) {
        symbolMaster.layers = this.drawElements(symbol.symbol);
      }

      page.addLayer(symbolMaster.generateObject());
    }
    return page;
  }

  drawPage(htmlPage: TraversedPage): Page {
    const element = htmlPage.element as ITraversedDomElement;

    console.log(element);
    const { height, width, x, y } = element.boundingClientRect;
    const bounding = { height, width, x, y } as IBounding;
    const page = new Page(bounding);
    const ab = new Artboard(bounding);
    page.name = htmlPage.pageUrl;
    ab.name = htmlPage.pageTitle;

    if (element.children) {
      for (let i = 0, max = element.children.length; i < max; i += 1) {
        ab.layers.push(...this.drawElements(element.children[i] as ITraversedDomElement));
      }
    }

    page.addLayer(ab.generateObject());
    return page;
  }

  private drawElements(element: ITraversedDomElement) {
    const node = new ElementDrawer(element);
    return [...node.layers];
  }

  private getSymbolSize(symbols: TraversedSymbol[], index: number): IBounding {
    const symbol = symbols[index];
    const element = symbol.symbol;
    const bcr = boundingClientRectToBounding(element.boundingClientRect);
    /**
     * get the first part of the symbol name button/bg-light/color-main
     * to group them vertically by component
     */
    if (index === 0) {
      bcr.x = 0;
      bcr.y = 0;
    } else if (symbol.name.split('/')[0] === this._lastSymbol.name.split('/')[0]) {
      bcr.y += Drawer.MARGIN + this._lastSymbol.y + this._lastSymbol.height;
      bcr.x = this._lastSymbol.x;
    } else {
      bcr.x += Drawer.MARGIN + this._lastSymbol.x + this._lastSymbol.width;
    }
    this._lastSymbol = { name: symbol.name, ...bcr };
    return bcr;
  }

  private getPageSize(symbols: TraversedSymbol[]): IBounding {
    const size: IBounding = { height: 0, width: 0, x: 0, y: 0 };
    for (let i = 0, max = symbols.length; i < max; i += 1) {
      const margin = (i > 0) ? Drawer.MARGIN : 0;
      const bcr = boundingClientRectToBounding(symbols[i].symbol.boundingClientRect);
      size.height += bcr.height + margin;
      size.width += bcr.width;
    }
    return size;
  }
}

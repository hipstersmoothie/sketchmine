import { Page } from "./sketchJSON/models/Page";
import { IBounding } from "./sketchJSON/interfaces/Base";
import { SymbolMaster } from "./sketchJSON/models/SymbolMaster";
import { Group } from "./sketchJSON/models/Group";
import { ITraversedDom, ITraversedDomElement } from "./TraversedDom";
import { BoundingClientRectToBounding } from "./sketchJSON/helpers/util";

export class Drawer {
  private static MARGIN = 40;
  private _lastSymbol: IBounding;

  drawSymbols(symbols: ITraversedDom[]): Page {
    // console.log(JSON.stringify(symbols, null, 2));
    const page = new Page(this.getPageSize(symbols));


    symbols.forEach(symbol => {
      const symbolSize = this.getSymbolSize(symbol);
      const symbolMaster = new SymbolMaster(symbolSize);
      symbolMaster.name = symbol.pageUrl;

      if (symbol.elements && symbol.elements.length > 0) {
        const groupSize = {...symbolSize, x: 0, y: 0};
        const group = new Group(groupSize);
        group.name = symbol.pageUrl;

        symbolMaster.addLayer(group.generateObject());
      }

      page.addLayer(symbolMaster.generateObject());
    });
    return page;
  }

  private getSymbolSize(symbol: ITraversedDom): IBounding {
    const element = this.getLargestElement(symbol.elements);
    const bcr = BoundingClientRectToBounding(element.boundingClientRect);
    if (!this._lastSymbol) {
      this._lastSymbol = bcr;
      return bcr;
    }
    bcr.x += Drawer.MARGIN + this._lastSymbol.x + this._lastSymbol.width;
    this._lastSymbol = bcr;
    return bcr;
  }

  private getLargestElement(elements: ITraversedDomElement[]): ITraversedDomElement {
    if(elements.length === 1) {
      return elements[0];
    }
    return elements.reduce((prev, current) => {
      return (prev.boundingClientRect.width > current.boundingClientRect.width) ? prev : current
    });
  }

  private getPageSize(pages: ITraversedDom[]): IBounding {
    const size: IBounding = {height: 0, width: 0, x: 0, y: 0};

    for (let i = 0, max = pages.length; i < max; i++) {
      const margin = (i > 0)? Drawer.MARGIN : 0;
      const bcr = BoundingClientRectToBounding(pages[i].elements[0].boundingClientRect);
      size.height += bcr.height + margin;
      size.width += bcr.width;
    }

    return size;
  }
}

import { UUID } from '../helpers/UUID';
import { Document, DocumentAssets, DocumentPage } from '../interfaces/Document';
import { SketchPage } from './SketchPage';

export class SketchDocument {
  private static _instance: SketchDocument;
  private static _objectID = UUID.generate();
  private _colors = []
  private _textStyles = [];
  private _pages = [];

  constructor(pages: SketchPage[]) {
    if (SketchDocument._instance) {
      return SketchDocument._instance;
    }
    SketchDocument._instance = this;
    this._pages = [...pages];
  }

  private addPages(): DocumentPage[] {
    const pages = [];
    this._pages.forEach((page: SketchPage) => {
      pages.push({
        _class: 'MSJSONFileReference',
        _ref_class: 'MSImmutablePage',
        _ref: `pages/${page.objectID}`
      })
    });

    return pages;
  }

  private addAssets(): DocumentAssets {
    return {
      _class: 'assetCollection',
      colors: [],
      gradients: [],
      imageCollection: {
        _class: 'imageCollection',
        images: {}
      },
      images: []
    }
  }
  
  generateObject(): Document {
    return {
      _class: 'document',
      do_objectID: SketchDocument._objectID,
      assets: this.addAssets(),
      colorSpace: 0,
      currentPageIndex: 0,
      foreignSymbols: [],
      layerStyles: {
        _class: 'sharedStyleContainer',
        objects: []
      },
      layerSymbols: {
        _class: 'symbolContainer',
        objects: []
      },
      layerTextStyles: {
        _class: 'sharedTextStyleContainer',
        objects: []
      },
      pages: this.addPages()
    }
  }
}

import { UUID } from '@sketchmine/helpers';
import { SketchDocument, SketchDocumentAssets, SketchDocumentPage } from '../interfaces';
import { Page } from './page';

export class Document {
  private static _instance: Document;
  private static _objectID = UUID.generate();
  private _pages = [];

  constructor(pages: Page[]) {
    if (Document._instance) {
      return Document._instance;
    }
    Document._instance = this;
    this._pages = [...pages];
  }

  private addPages(): SketchDocumentPage[] {
    const pages = [];
    this._pages.forEach((page: Page) => {
      pages.push({
        _class: 'MSJSONFileReference',
        _ref_class: 'MSImmutablePage',
        _ref: `pages/${page.objectID}`,
      });
    });

    return pages;
  }

  private addAssets(): SketchDocumentAssets {
    return {
      _class: 'assetCollection',
      colors: [],
      gradients: [],
      imageCollection: {
        _class: 'imageCollection',
        images: {},
      },
      images: [],
    };
  }

  generateObject(): SketchDocument {
    return {
      _class: 'document',
      do_objectID: Document._objectID,
      assets: this.addAssets(),
      colorSpace: 0,
      currentPageIndex: 0,
      foreignSymbols: [],
      foreignTextStyles: [],
      layerStyles: {
        _class: 'sharedStyleContainer',
        objects: [],
      },
      layerSymbols: {
        _class: 'symbolContainer',
        objects: [],
      },
      layerTextStyles: {
        _class: 'sharedTextStyleContainer',
        objects: [],
      },
      pages: this.addPages(),
    };
  }
}

export interface SketchDocument {
  _class: string;
  do_objectID: string;
  assets: IDocumentAssets;
  colorSpace: number;
  currentPageIndex: number;
  foreignSymbols: any[];
  layerStyles: IDocumentLayerStyles;
  layerSymbols: IDocumentLayerStyles;
  layerTextStyles: IDocumentLayerStyles;
  pages: IDocumentPage[];
}

export interface IDocumentAssets {
  _class: string;
  colors: any[];
  gradients: any[];
  imageCollection: IDocumentImageCollection;
  images: any[];
}

export interface IDocumentPage {
  _class: string;
  _ref_class: string;
  _ref: string;
}

export interface IDocumentLayerStyles {
  _class: string;
  objects: any[];
}

export interface IDocumentImageCollection {
  _class: string;
  images: IImages;
}

export interface IImages {
}

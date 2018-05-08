export interface Document {
  _class: string;
  do_objectID: string;
  assets: DocumentAssets;
  colorSpace: number;
  currentPageIndex: number;
  foreignSymbols: any[];
  layerStyles: DocumentLayerStyles;
  layerSymbols: DocumentLayerStyles;
  layerTextStyles: DocumentLayerStyles;
  pages: DocumentPage[];
}

export interface DocumentAssets {
  _class: string;
  colors: any[];
  gradients: any[];
  imageCollection: DocumentImageCollection;
  images: any[];
}

export interface DocumentPage {
  _class: string;
  _ref_class: string;
  _ref: string;
}

export interface DocumentLayerStyles {
  _class: string;
  objects: any[];
}


export interface DocumentImageCollection {
  _class: string;
  images: Images;
}

export interface Images {
}

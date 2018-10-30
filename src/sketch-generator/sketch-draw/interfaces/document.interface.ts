import { SketchForeignTextStyles } from './text-style.interface';

export interface SketchDocument {
  _class: string;
  do_objectID: string;
  assets: SketchDocumentAssets;
  colorSpace: number;
  currentPageIndex: number;
  foreignSymbols: any[];
  foreignTextStyles: SketchForeignTextStyles[];
  layerStyles: SketchDocumentLayerStyles;
  layerSymbols: SketchDocumentLayerStyles;
  layerTextStyles: SketchDocumentLayerStyles;
  pages: SketchDocumentPage[];
}
export interface SketchDocumentAssets {
  _class: string;
  colors: any[];
  gradients: any[];
  imageCollection: SketchDocumentImageCollection;
  images: any[];
}

export interface SketchDocumentPage {
  _class: string;
  _ref_class: string;
  _ref: string;
}

export interface SketchDocumentLayerStyles {
  _class: string;
  objects: any[];
}

export interface SketchDocumentImageCollection {
  _class: string;
  images: SketchImages;
}

export interface SketchImages {
}

export interface SketchMeta {
  commit: string;
  pagesAndArtboards: { [key: string]: SketchPagesAndArtboards };
  version: number;
  fonts: any[];
  compatibilityVersion: number;
  app: string;
  autosaved: number;
  variant: string;
  created: SketchMetaCreated;
  saveHistory: string[];
  appVersion: string;
  build: number;
}

export interface SketchMetaCreated {
  commit: string;
  appVersion: string;
  build: number;
  app: string;
  compatibilityVersion: number;
  version: number;
  variant: string;
}

export interface SketchPagesAndArtboards {
  name: string;
  artboards: { [key: string]: SketchMetaArtboard };
}

export interface SketchMetaArtboard {
  name: string;
}

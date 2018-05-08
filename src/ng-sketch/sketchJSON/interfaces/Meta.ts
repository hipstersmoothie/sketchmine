export interface Meta {
  commit: string;
  pagesAndArtboards: { [key: string]: MetaPagesAndArtboards }
  version: number;
  fonts: any[];
  compatibilityVersion: number;
  app: string;
  autosaved: number;
  variant: string;
  created: MetaCreated;
  saveHistory: string[];
  appVersion: string;
  build: number;
}

export interface MetaCreated {
  commit: string;
  appVersion: string;
  build: number;
  app: string;
  compatibilityVersion: number;
  version: number;
  variant: string;
}

export interface MetaPagesAndArtboards {
  name: string;
  artboards: { [key: string]: MetaArtboard };
}

export interface MetaArtboard {
  name: string;
}


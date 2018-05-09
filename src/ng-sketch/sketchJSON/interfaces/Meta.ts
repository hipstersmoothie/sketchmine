export interface IMeta {
  commit: string;
  pagesAndArtboards: { [key: string]: IMetaPagesAndArtboards }
  version: number;
  fonts: any[];
  compatibilityVersion: number;
  app: string;
  autosaved: number;
  variant: string;
  created: IMetaCreated;
  saveHistory: string[];
  appVersion: string;
  build: number;
}

export interface IMetaCreated {
  commit: string;
  appVersion: string;
  build: number;
  app: string;
  compatibilityVersion: number;
  version: number;
  variant: string;
}

export interface IMetaPagesAndArtboards {
  name: string;
  artboards: { [key: string]: IMetaArtboard };
}

export interface IMetaArtboard {
  name: string;
}


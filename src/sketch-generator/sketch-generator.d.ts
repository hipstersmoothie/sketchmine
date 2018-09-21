export namespace SketchGenerator {

  export interface Config {
    metaInformation: string;
    host: Host;
    rootElement: string;
    library?: Library;
    pages: string[];
    outFile: string;
    chrome: Chrome;
  }

  export interface Library {
    app: string;
  }

  export interface Host {
    protocol: string;
    name: string;
    port?: number;
  }

  export interface DefaultViewport {
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    isLandscape: boolean;
  }

  export interface Chrome {
    defaultViewport: DefaultViewport;
  }
}


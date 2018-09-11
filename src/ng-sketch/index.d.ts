export namespace SG {

  export interface Config {
    args: Args;
    pages: string[];
    chrome: Chrome;
  }
  export interface Args {
    metaInformation: string;
    host: string;
    rootElement: string;
    api: boolean;
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


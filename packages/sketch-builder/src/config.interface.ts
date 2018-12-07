export interface SketchBuilderConfig {
  chrome: Chrome;
  host: Host;
  outFile: string;
  pages: string[];
  rootElement: string;
  agent: string; // path to the dom-agent that should be injected
  previewImage?: string;
  library?: Library;
  metaInformation?: string;
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

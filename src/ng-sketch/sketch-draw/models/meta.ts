import { IMeta, IMetaPagesAndArtboards, IMetaArtboard } from '@sketch-draw/interfaces';
import { Page } from '@sketch-draw/models/page';

export class Meta {
  private static _instance: Meta;
  private static _version = 101;
  private static _compatVersion = 93;
  private static _appVersion = '49.3';
  private static _appUrl = 'com.bohemiancoding.sketch3';
  private static _commit = '2b45d75f77b3d86c8cfab3e1090bcc520c37ea74';
  private static _variant = 'NONAPPSTORE';
  private static _fonts = ['BerninaSans'];
  private static _build = 51167;
  private _pages = [];

  constructor(pages: Page[]) {
    if (Meta._instance) {
      return Meta._instance;
    }
    Meta._instance = this;
    this._pages = [...pages];
  }

  private addArtboards(page: Page): { [key: string]: IMetaArtboard } {
    const artboards = {};
    page.layers.forEach((layer) => {
      artboards[layer.do_objectID] = {
        name: layer.name,
      };
    });
    return artboards;
  }

  private addPagesAndArtboards(): { [key: string]: IMetaPagesAndArtboards } {
    const artboards = {};
    this._pages.forEach((page: Page) => {
      artboards[page.objectID] = {
        name: 'Symbols',
        artboards: this.addArtboards(page),
      };
    });

    return artboards as { [key: string]: IMetaPagesAndArtboards };
  }

  generateObject(): IMeta {
    return {
      commit: Meta._commit,
      pagesAndArtboards: this.addPagesAndArtboards(),
      version: Meta._version,
      fonts: Meta._fonts,
      compatibilityVersion: Meta._compatVersion,
      app: Meta._appUrl,
      autosaved: 0,
      variant: Meta._variant,
      created: {
        commit: Meta._commit,
        appVersion: Meta._appVersion,
        build: Meta._build,
        app: Meta._appUrl,
        compatibilityVersion: Meta._compatVersion,
        version: Meta._version,
        variant: Meta._variant,
      },
      saveHistory: [
        `${Meta._variant}.${Meta._build}`,
      ],
      appVersion: Meta._appVersion,
      build: Meta._build,
    };
  }
}

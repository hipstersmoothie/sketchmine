import { Meta, MetaPagesAndArtboards, MetaArtboard } from "../interfaces/Meta";
import { SketchPage } from "./SketchPage";

export class SketchMeta {
  private static _instance: SketchMeta;
  private static _version: 101;
  private static _compatVersion: 93;
  private static _appVersion: '49.3';
  private static _appUrl: 'com.bohemiancoding.sketch3';
  private static _commit: '2b45d75f77b3d86c8cfab3e1090bcc520c37ea74';
  private static _variant: 'NONAPPSTORE';
  private static _build: 51167;
  private _pages = [];

  constructor(pages: SketchPage[]) {
    if (SketchMeta._instance) {
      return SketchMeta._instance;
    }
    SketchMeta._instance = this;
    this._pages = [...pages];
  }

  private addArtboards(): { [key: string]: MetaArtboard } {
    return {
      'BAA32457-CC1E-42E6-93F6-138699AA7338': {
        name: 'dt-button'
      }
    }
  }

  private addPagesAndArtboards(): { [key: string]: MetaPagesAndArtboards } {
    const artboards = {};
    this._pages.forEach((page: SketchPage) => {
      artboards[page.objectID] = {
        name: 'Symbols',
        artboards: this.addArtboards()
      }
    });

    return artboards as { [key: string]: MetaPagesAndArtboards };
  }


  generateObject(): Meta {
    // return {
    //   commit: SketchMeta._commit,
    //   pagesAndArtboards: this.addPagesAndArtboards(),
    //   version: SketchMeta._version,
    //   fonts: [],
    //   compatibilityVersion: SketchMeta._compatVersion,
    //   app: SketchMeta._appUrl,
    //   autosaved: 0,
    //   variant: SketchMeta._variant,
    //   created: {
    //     commit: SketchMeta._commit,
    //     appVersion: SketchMeta._appVersion,
    //     build: SketchMeta._build,
    //     app: SketchMeta._appUrl,
    //     compatibilityVersion: SketchMeta._compatVersion,
    //     version: SketchMeta._version,
    //     variant: SketchMeta._variant
    //   },
    //   saveHistory: [
    //     `${SketchMeta._variant}.${SketchMeta._build}`
    //   ],
    //   appVersion: SketchMeta._appVersion,
    //   build: SketchMeta._build
    // }
    console.log(SketchMeta._version)
    return {
      commit: '2b45d75f77b3d86c8cfab3e1090bcc520c37ea74',
      pagesAndArtboards: this.addPagesAndArtboards(),
      version: 101,
      fonts: [],
      compatibilityVersion: 93,
      app: 'com.bohemiancoding.sketch3',
      autosaved: 0,
      variant: 'NONAPPSTORE',
      created: {
        commit: '2b45d75f77b3d86c8cfab3e1090bcc520c37ea74',
        appVersion: '49.3',
        build: 51167,
        app: 'com.bohemiancoding.sketch3',
        compatibilityVersion: 93,
        version: 101,
        variant: 'NONAPPSTORE'
      },
      saveHistory: [
        'NONAPPSTORE.51167'
      ],
      appVersion: '49.3',
      build: 51167
    }
    
  }
}

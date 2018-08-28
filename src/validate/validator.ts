import { IValidationRule, IValidationContext, SketchModel } from './interfaces/validation-rule.interface';
import { IBase } from '@sketch-draw/interfaces';
import { readFile } from '@utils';
import chalk from 'chalk';
import { Teacher } from './teacher';

export class Validator {
  private _rulesSelectors: string[] = [];
  private _matchedRules: IValidationContext[] = [];
  private _currentArtboard: string;
  private _currentSymbol: string;
  private _currentPage: string;
  private _files: IBase[] = [];

  constructor(private _rules: IValidationRule[]) {
    /** selector array is faster to check than always lookup in an object */
    this._rules.forEach((rule: IValidationRule) => this._rulesSelectors.push(...rule.selector));
  }

  /**
   * Add files to validate
   * You can Provide a String (path) to a file or an object with the filecontent to be validated
   * @param file string | Object
   */
  async addFile(file: string | Object): Promise<void> {
    if (!file) {
      throw Error(chalk`{bgRed Please Provide a path to a JSON file, or an object so that we can validate it!}`);
    }
    const content = (typeof file === 'object') ? file : JSON.parse(await readFile(file));
    this._files.push(content);
  }

  /** alidates a sketch file with the given rules. */
  async validate() {
    if (this._files.length === 0) {
      throw Error(chalk`{bgRed No files to validate!}`);
    }
    this._files.forEach((content) => {
      this.collectModules(content);
      this.correct();
    });
  }

  /** 👩🏼‍🏫 The teacher applies the rules for you */
  private correct() {
    if (this._matchedRules.length === 0) {
      return;
    }
    /** We call her verena, because pinkys girlfriend is a teacher 💁🏻‍ */
    const verena = new Teacher(this._rules);
    verena.improve(this._matchedRules);
  }

  /**
   * Gathers the matching Objects from the Sketch JSON file
   * and stores it in an array
   * @param content IBase
   */
  private collectModules(content: IBase) {
    this.setCurrentParents(content);

    if (this._rulesSelectors.includes(content._class)) {
      const rule = this._rules.find(rule => rule.selector.includes(content._class as SketchModel));
      if (rule.ignoreArtboards && rule.ignoreArtboards.includes(this._currentArtboard)) {
        return;
      }
      this._matchedRules.push(this.getProperties(content));
    }

    if (!content.layers) {
      return;
    }
    /** check for childs and call recurse */
    content.layers.forEach((layer) => {
      this.collectModules(layer);
    });
  }

  /**
   * Get the current Artboard, Page, SymbolMaster
   * @param content IBase
   */
  private setCurrentParents(content: IBase) {
    if (content._class === 'page') {
      this._currentArtboard = undefined;
      this._currentSymbol = undefined;
      this._currentPage = content.name;
    }
    if (content._class === 'artboard') {
      this._currentArtboard = content.name;
    }
    if (content._class === 'symbolMaster') {
      this._currentSymbol = content.name;
    }
  }

  /**
   * Get only needed properties from Object.
   * @param layer IBase
   * @returns IValidationContext
   */
  private getProperties(layer: IBase): IValidationContext {
    const obj =  {
      _class: layer._class,
      do_objectID: layer.do_objectID,
      name: layer.name,
      parents: {
        page: this._currentPage,
        artboard: this._currentArtboard,
        symbolMaster: this._currentSymbol,
      },
    } as IValidationContext;

    if (layer.style) {
      obj.style = layer.style;
    }

    return obj;
  }
}

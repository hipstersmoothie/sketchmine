import { IValidationRule, IValidationContext, SketchModel } from './interfaces/validation-rule.interface';
import { SketchBase, SketchStyle } from '@sketch-draw/interfaces';
import chalk from 'chalk';
import { Teacher } from './teacher';

export class Validator {
  matchedRules: IValidationContext[] = [];
  private _rulesSelectors: string[] = [];
  private _currentArtboard: string;
  private _currentSymbol: string;
  private _currentPage: string;
  private _files: SketchBase[] = [];

  constructor(private _rules: IValidationRule[], public env: string) {
    /** selector array is faster to check than always lookup in an object */
    this._rules.forEach((rule: IValidationRule) => this._rulesSelectors.push(...rule.selector));
  }

  /**
   * Add files to validate
   * You can Provide a String (path) to a file or an object with the filecontent to be validated
   * @param file string | Object
   */
  async addFile(file: Object): Promise<void> {
    if (!file || typeof file !== 'object') {
      throw Error(chalk`{bgRed Please provide a valid JSON object so that we can validate it!}`);
    }
    this._files.push(file as SketchBase);
  }

  /** validates a sketch file with the given rules. */
  validate() {
    if (this._files.length === 0) {
      throw Error(chalk`{bgRed No files to validate!}`);
    }
    this._files.forEach((content) => {
      this.collectModules(content);
    });
    this.correct();
  }

  /** 👩🏼‍🏫 The teacher applies the rules for you */
  private correct() {
    if (this.matchedRules.length === 0) {
      return;
    }
    /** We call her verena, because pinkys girlfriend is a teacher 💁🏻‍ */
    const verena = new Teacher(this._rules);
    verena.improve(this.matchedRules);
  }

    /**
   * Checks if rule is unrelvant for current validation and can be excluded.
   * @param rule rule to check
   */
  private excludeRule(rule: IValidationRule): boolean {
    return rule.ignoreArtboards && rule.ignoreArtboards.includes(this._currentArtboard) ||
      rule.env && !rule.env.includes(this.env) ||
      rule.includePages && !rule.includePages.includes(this._currentPage);
  }

  /**
   * Gathers the matching Objects from the Sketch JSON file
   * and stores it in an array
   * @param content IBase
   */
  private collectModules(content: SketchBase) {
    this.setCurrentParents(content);
    if (this._rulesSelectors.includes(content._class)) {
      const rule = this._rules.find(rule => rule.selector.includes(content._class as SketchModel));
      if (!this.excludeRule(rule)) {
        this.matchedRules.push(this.getProperties(content, rule.options || {}));
      }
    }

    if (content.layers && content.layers.length) {
      /** check for childs and call recurse */
      content.layers.forEach((layer) => {
        this.collectModules(layer);
      });
    }
  }

  /**
   * Get the current Artboard, Page, SymbolMaster
   * @param content IBase
   */
  private setCurrentParents(content: SketchBase) {
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
  private getProperties(layer: SketchBase, ruleOptions: { [key: string]: any }): IValidationContext {
    const obj =  {
      _class: layer._class,
      do_objectID: layer.do_objectID,
      name: layer.name,
      parents: {
        page: this._currentPage,
        artboard: this._currentArtboard,
        symbolMaster: this._currentSymbol,
      },
      ruleOptions,
    } as IValidationContext;

    if (layer.style) {
      obj.style = layer.style as SketchStyle;
    }
    if (layer.frame) {
      obj.frame = layer.frame;
    }
    if (layer.layers) {
      obj.layerSize = layer.layers.length;
    }
    return obj;
  }
}

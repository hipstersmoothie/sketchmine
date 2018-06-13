import { IValidationRule, IValdiationContext, SketchModel } from './interfaces/IValidationRule';
import { IBase } from 'ng-sketch/sketchJSON/interfaces/Base';
import { IPage } from 'ng-sketch/sketchJSON/interfaces/page';
import { readFile } from '../utils/read-file';
import chalk from 'chalk';
import { Teacher } from './Teacher';
import { ErrorHandler } from './error/ErrorHandler';

export class Validator {
  private _rulesSelectors: string[] = [];
  private _matchedRules: IValdiationContext[] = [];

  private _files: IPage[] = [];

  constructor(
    private _rules: IValidationRule[],
  ) {
    // selector array is faster to check than always lookup in an object
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

  /**
   * Validates a sketch file with the given rules.
   */
  async validate() {
    if (this._files.length === 0) {
      throw Error(chalk`{bgRed No files to validate!}`);
    }
    this._files.forEach((content) => {
      this.collectModules(content);
      this.correct();
    });
  }

  /**
   * 👩🏼‍🏫 The teacher applies the rules for you
   */
  private correct() {
    if (this._matchedRules.length === 0) {
      return;
    }
    // We call her verena, because pinkys girlfriend is a teacher 💁🏻‍
    const verena = new Teacher(this._rules);
    verena.improve(this._matchedRules);
  }

  /**
   * Gathers the matching Objects from the Sketch JSON file
   * and stores it in an array
   * @param content IBase
   */
  private collectModules(content: IPage | IBase) {

    if (this._rulesSelectors.includes(content._class)) {
      const rule = this._rules.find(rule => rule.selector.includes(content._class as SketchModel));
      this._matchedRules.push(this.getProperties(content));
    }

    if (!content.layers) {
      return;
    }
    // check for childs and call recurse
    content.layers.forEach((layer) => {
      this.collectModules(layer);
    });
  }

  /**
   * Get only needed properties from Object.
   * @param layer IBase
   * @returns IValidationContext
   */
  private getProperties(layer: IBase): IValdiationContext {
    const obj =  {
      _class: layer._class,
      do_objectID: layer.do_objectID,
      name: layer.name,
    } as IValdiationContext;

    if (layer.style) {
      obj.style = layer.style;
    }

    return obj;
  }
}

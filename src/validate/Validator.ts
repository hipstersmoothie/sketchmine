import { IValidationRule, IValdiationContext } from './interfaces/IValidationRule';
import { IBase } from 'ng-sketch/sketchJSON/interfaces/Base';
import { readFile } from '../utils/read-file';
import chalk from 'chalk';
import { Teacher } from './Teacher';

export class Validator {
  private _rulesSelectors: string[];
  private _matchedRules: IValdiationContext[] = [];

  constructor(
    private _rules: IValidationRule[],
    private _file?: string,
  ) {
    // selector array is faster to check than always lookup in an object
    this._rulesSelectors = this._rules.map(rule => rule.selector);
  }

  async validate(file?: string) {
    if (!this._file && !file) {
      throw Error(chalk`{bgRed Please Provide a path to a JSON file so that we can validate it for you!}`);
    }

    if (process.env.DEBUG) {
      console.log(chalk`{bgCyan Start debugging Sketch file:}\n${this._file}`);
    }

    if (file) {
      const content = JSON.parse(await readFile(file));
      this.collectModules(content);
      // console.log(this._matchedRules);
      this.correct();
    }
  }

  /**
   * 👩🏼‍🏫 The teacher applies the rules for you
   */
  private correct() {
    // We call her verena, because pinkys girlfriend is a teacher 💁🏻‍
    const verena = new Teacher(this._rules);
    verena.improve(this._matchedRules);
  }

  /**
   * Gathers the matching Objects from the Sketch JSON file
   * and stores it in an array
   * @param content IBase
   */
  private collectModules(content: IBase) {

    if (this._rulesSelectors.includes(content._class)) {
      const rule = this._rules.find(rule => rule.selector === content._class);
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
    return {
      _class: layer._class,
      do_objectID: layer.do_objectID,
      name: layer.name,
    };
  }
}

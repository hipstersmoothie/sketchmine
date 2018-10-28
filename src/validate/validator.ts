import {
  SketchBase,
  SketchObjectTypes,
  SketchStyle,
  SketchText,
} from '@sketch-draw/interfaces';
import { readFile } from '@utils';
import chalk from 'chalk';
import {
  IValidationContext,
  IValidationRule,
  ValidationRequirements,
} from './interfaces/validation-rule.interface';
import { Teacher } from './teacher';

export class Validator {
  matchedRules: IValidationContext[] = [];
  private _rulesSelectors: string[] = [];
  private _currentArtboard: string;
  private _currentSymbol: string;
  private _currentPage: string;
  private _files: SketchBase[] = [];
  private _document: SketchBase;

  constructor(private _rules: IValidationRule[], public env: string) {
    /** selector array is faster to check than always lookup in an object */
    this._rules.forEach((rule: IValidationRule) => this._rulesSelectors.push(...rule.selector));
  }

  /**
   * Add files to validate.
   * You can provide a string (path) to a file or an object with the filecontent to be validated.
   * @param file string | Object
   */
  async addFile(file: string | Object): Promise<void> {
    if (!file) {
      throw Error(chalk`{bgRed Please provide a path to a JSON file or an object that can be validated!}`);
    }
    const content = (typeof file === 'object') ? file : JSON.parse(await readFile(file));
    this._files.push(content);
  }

  /**
   * Add document JSON file needed for some validations.
   * @param file string | Object
   */
  async addDocumentFile(file: string | Object): Promise<void> {
    if (!file) {
      throw Error(chalk`{bgRed Please provide a document JSON file!}`);
    }
    const content = (typeof file === 'object') ? file : JSON.parse(await readFile(file));
    this._document = content;
  }

  /**
   * Validates a Sketch file according to the given rules.
   */
  validate() {
    if (this._files.length === 0) {
      throw Error(chalk`{bgRed No files to validate!}`);
    }
    this._files.forEach((content) => {
      this.collectModules(content);
    });
    this.correct();
  }

  /**
   * 👩🏼‍🏫 The teacher applies the rules for you.
   */
  private correct() {
    if (this.matchedRules.length === 0) {
      return;
    }
    // We call her Verena, because Pinky's girlfriend is a teacher 💁🏻‍.
    const verena = new Teacher(this._rules);
    verena.improve(this.matchedRules);
  }

  /**
   * Checks if rule is unrelvant for the current validation and can be excluded.
   * @param rule rule to check
   */
  private excludeRule(rule: IValidationRule): boolean {
    return rule.ignoreArtboards && rule.ignoreArtboards.includes(this._currentArtboard) ||
      rule.env && !rule.env.includes(this.env) ||
      rule.includePages && !rule.includePages.includes(this._currentPage);
  }

  /**
   * Gathers the matching objects from the Sketch JSON file
   * and stores it in an array.
   * @param content SketchBase
   */
  private collectModules(content: SketchBase) {
    this.setCurrentParents(content);
    if (this._rulesSelectors.includes(content._class)) {
      /**
       * TODO: fix it
       * What if there are more rules matching the same selector?
       * ... "find" only finds the first matching rule
       */
      const rule = this._rules.find(rule => rule.selector.includes(content._class as SketchObjectTypes));
      if (this.excludeRule(rule)) {
        return;
      }
      this.matchedRules.push(this.getProperties(content, rule.options || {}));
    }

    if (!content.layers) {
      return;
    }
    /** Check for children and call function recursively. */
    content.layers.forEach((layer) => {
      this.collectModules(layer);
    });
  }

  /**
   * Get the current artboard, page, symbolMaster.
   * @param content SketchBase
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
   * Get only needed properties from object.
   * @param layer SketchBase
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

    /**
     * Extend validation context depending on rule requirements defined in validator config.
     */
    const requirements = ruleOptions.requirements;
    if (requirements) {
      if (requirements.includes(ValidationRequirements.Style) && layer.style) {
        obj.style = layer.style as SketchStyle;
        obj.sharedStyleID = layer.sharedStyleID;
      }
      if (requirements.includes(ValidationRequirements.AttributedString)
            && (layer as SketchText).attributedString && (layer as SketchText).attributedString.attributes) {
        obj.stringAttributes = (layer as SketchText).attributedString.attributes;
      }
      if (requirements.includes(ValidationRequirements.Frame) && layer.frame) {
        obj.frame = layer.frame;
      }
      if (requirements.includes(ValidationRequirements.LayerSize) && layer.layers) {
        obj.layerSize = layer.layers.length;
      }
      if (requirements.includes(ValidationRequirements.DocumentReference) && this._document) {
        obj.document = this._document;
      }
    }

    return obj;
  }
}

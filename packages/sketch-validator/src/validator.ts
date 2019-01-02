import {
  SketchBase,
  SketchObjectTypes,
  SketchStyle,
  SketchText,
} from '@sketchmine/sketch-file-format';
import chalk from 'chalk';
import cloneDeep from 'lodash/cloneDeep';
import {
  IValidationContext,
  IValidationContextChildren,
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
  files: SketchBase[] = [];
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
  addFile(file: SketchBase) {
    if (!file || typeof file !== 'object') {
      throw Error(chalk`{bgRed Please provide a valid JSON object so that we can validate it!}`);
    }
    this.files.push(file);
  }

  /**
   * Add document JSON file needed for some validations.
   * @param file string | Object
   */
  addDocumentFile(file: SketchBase) {
    if (!file || typeof file !== 'object') {
      throw Error(chalk`{bgRed Please provide a valid JSON object of the document JSON file!}`);
    }
    this._document = file;
  }

  /**
   * Validates a Sketch file according to the given rules.
   */
  validate() {
    if (this.files.length === 0) {
      throw Error(chalk`{bgRed No files to validate!}`);
    }
    this.files.forEach((content) => {
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
      const selectedRules = this._rules.filter(rule => rule.selector.includes(content._class as SketchObjectTypes));
      for (let i = 0; i < selectedRules.length; i += 1) {
        if (!this.excludeRule(selectedRules[i])) {
          this.matchedRules.push(this.getProperties(content, selectedRules[i].options || {}));
        }
      }
    }

    if (content.layers && content.layers.length) {
      /** Check for children and call function recursively. */
      content.layers.forEach((layer) => {
        this.collectModules(layer);
      });
    }
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
      ruleOptions: cloneDeep(ruleOptions),
    } as IValidationContext;

    /**
     * Extend validation context depending on rule requirements defined in validator config.
     */
    const requirements = ruleOptions.requirements;
    if (requirements) {
      if (requirements.includes(ValidationRequirements.Style) && layer.style) {
        obj.style = layer.style as SketchStyle;
      }
      if (requirements.includes(ValidationRequirements.Style) && (layer as SketchText).sharedStyleID) {
        obj.ruleOptions.sharedStyleID = (layer as SketchText).sharedStyleID;
      }
      if (requirements.includes(ValidationRequirements.AttributedString)
            && (layer as SketchText).attributedString && (layer as SketchText).attributedString.attributes) {
        obj.ruleOptions.stringAttributes = (layer as SketchText).attributedString.attributes;
      }
      if (requirements.includes(ValidationRequirements.Frame) && layer.frame) {
        obj.frame = layer.frame;
      }
      if (requirements.includes(ValidationRequirements.LayerSize) && layer.layers) {
        obj.ruleOptions.layerSize = layer.layers.length;
      }
      if (requirements.includes(ValidationRequirements.DocumentReference) && this._document) {
        obj.ruleOptions.document = this._document;
      }
      if (requirements.includes(ValidationRequirements.Children)) {
        if (layer.layers && layer.layers.length) {
          obj.ruleOptions.children = layer.layers.map((l) => {
            return { name: l.name, class: l._class } as  IValidationContextChildren;
          });
        } else {
          obj.ruleOptions.children = [];
        }
      }
    }

    return obj;
  }
}

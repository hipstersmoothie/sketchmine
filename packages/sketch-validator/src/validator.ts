import {
  SketchBase,
  SketchObjectTypes,
  SketchStyle,
  SketchText,
  SketchArtboard,
} from '@sketchmine/sketch-file-format';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import {
  IValidationContext,
  IValidationContextChildren,
  IValidationRule,
  ValidationRequirements,
} from './interfaces/validation-rule.interface';
import { Teacher } from './teacher';
import { ErrorHandler } from './error/error-handler';

export class Validator {
  homeworks: IValidationContext[] = [];
  files: SketchBase[] = [];
  private rulesSelectors = new Set<string>();
  private currentArtboard: string;
  private currentSymbol: string;
  private currentPage: string;
  private document: SketchBase;

  constructor(
    private rules: IValidationRule[],
    private handler: ErrorHandler,
    public env: string,
  ) {
    /** Set of selectors is faster to check than always lookup in an object */
    this.rules.forEach((rule: IValidationRule) =>
      this.rulesSelectors = new Set([...this.rulesSelectors, ...rule.selector]));
  }

  /**
   * Add files to validate.
   * You can provide a string (path) to a file or an object with the file content to be validated.
   * @param file string | Object
   */
  addFile(file: SketchBase) {
    if (!file || typeof file !== 'object') {
      throw Error('Please provide a valid JSON object so that we can validate it!');
    }
    this.files.push(file);
  }

  /**
   * Add document JSON file needed for some validations.
   * @param file string | Object
   */
  addDocumentFile(file: SketchBase) {
    if (!file || typeof file !== 'object') {
      throw Error('Please provide a valid JSON object of the document JSON file!');
    }
    this.document = file;
  }

  /**
   * Validates a Sketch file according to the given rules.
   */
  validate() {
    if (this.files.length === 0) {
      throw Error('No files to validate!');
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
    if (this.homeworks.length === 0) {
      return;
    }
    // We call her Verena, because Pinky's girlfriend is a teacher 💁🏻‍.
    const verena = new Teacher(this.rules, this.handler);
    verena.improve(this.homeworks);
  }

  /**
   * Checks if rule is irrelevant for the current validation and can be excluded.
   * @param rule rule to check
   */
  private excludeRule(rule: IValidationRule): boolean {
    return rule.ignoreArtboards && rule.ignoreArtboards.includes(this.currentArtboard) ||
      rule.env && !rule.env.includes(this.env) ||
      rule.includePages && !rule.includePages.includes(this.currentPage);
  }

  /**
   * Gathers the matching objects from the Sketch JSON file
   * and stores it in an homeworks array that is later passed to the teacher.
   * @param content SketchBase
   */
  private collectModules(content: SketchBase) {
    this.setCurrentParents(content);
    if (this.rulesSelectors.has(content._class)) {
      // Check all rules if they match the given content layer.
      const matchingRules = this.rules.filter(rule =>
        rule.selector.includes(content._class as SketchObjectTypes) &&
        !this.excludeRule(rule),
      );

      // If no rules pass the matching criterias, we can return here.
      if (matchingRules.length < 1) {
        return;
      }

      // Merge given options of all matching rules into one options object.
      const options: { [key: string]: any } = merge({}, ...matchingRules.map(rule => rule.options));
      const obj: Partial<IValidationContext> = {
        ...this.getProperties(content, options || {}),
        ruleNames: matchingRules.map(rule => rule.name),
      };

      /**
       * Add object containing all needed properties collected from Sketch json file
       * combined with validation rule names to homeworks array.
       */
      this.homeworks.push(obj as IValidationContext);
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
      this.currentArtboard = undefined;
      this.currentSymbol = undefined;
      this.currentPage = content.name;
    }
    if (content._class === 'artboard') {
      this.currentArtboard = content.name;
    }
    if (content._class === 'symbolMaster') {
      this.currentSymbol = content.name;
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
        page: this.currentPage,
        artboard: this.currentArtboard,
        symbolMaster: this.currentSymbol,
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
      if (requirements.includes(ValidationRequirements.BackgroundColor)
            && (layer as SketchArtboard).hasBackgroundColor && (layer as SketchArtboard).backgroundColor) {
        obj.backgroundColor = (layer as SketchArtboard).backgroundColor;
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
      if (requirements.includes(ValidationRequirements.DocumentReference) && this.document) {
        obj.ruleOptions.document = this.document;
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

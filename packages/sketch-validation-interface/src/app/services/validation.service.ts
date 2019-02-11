import { Injectable } from '@angular/core';
import { rules, Validator, ErrorHandler, IValidationRule } from '@sketchmine/sketch-validator';
import { ValidationConfig } from '../interfaces';
import { DocumentResponseData, CommunicationService } from './communication.service';
import { fileName } from '../pipes';
import { Logger } from '../classes';
import { MatSnackBar } from '@angular/material';

const COLOR_RULE = 'color-palette-validation';
const PARTY = ['🎉', '🍺', '🏆', '🐳', '🦄'];

export interface ActiveRule extends IValidationRule {
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ValidationService {

  logger: Logger = new Logger();
  colorsFile: string = '';
  sketchDocument: DocumentResponseData;

  constructor(
    private communicationService: CommunicationService,
    private snackBar: MatSnackBar,
  ) {}

  getRules(): ActiveRule[] {
    const activeRules: ActiveRule[] = [];

    rules.forEach((rule: IValidationRule) => {
      activeRules.push({
        ...rule,
        active: true,
      });
    });

    return activeRules;
  }

  validate(config: ValidationConfig): any[] {
    const handler = new ErrorHandler(this.logger);

    const validator = new Validator(
      this.addColors(config.rules),
      handler,
      config.env,
    );

    this.communicationService
      .inform(`⚙️ Start validating the file ${fileName(this.sketchDocument.path, '#filename.#ending')}`)
      .subscribe();

    handler.rulesStack = {};
    validator.addDocumentFile(this.sketchDocument.document);
    this.getPages(config.pages).forEach(page => validator.addFile(page));

    try {
      validator.validate();
    } catch (error) {
      console.log(error);
      this.snackBar.open(`🚫 ${error.message}`);
      return;
    }

    console.log('after try catch')

    const ruleNames = Object.keys(handler.rulesStack);
    const result = [];

    for (const name of ruleNames) {
      result.push({
        id: name,
        ...handler.rulesStack[name],
      });
    }

    if (result.every(r => r.failing.length === 0)) {
      const message = `Well done, every Rule passed! ${this.getPartyEmoji()}`;
      this.communicationService.playSound('Submarine');
      this.communicationService.inform(message);
      this.snackBar.open(message);
    }

    return result;
  }

  private getPartyEmoji(): string {
    const index =  Math.floor(Math.random() * Math.floor(PARTY.length));
    return PARTY[index];
  }

  private addColors(rules: any): any {
    if (!this.colorsFile.length) {
      return rules;
    }
    rules.forEach((rule) => {
      if (rule.name === COLOR_RULE && rule.hasOwnProperty('options')) {
        rule.options.colors = this.colorsFile;
      }
    });
    return rules;
  }

  private getPages(pages: string[]): any[] {
    if (pages.includes('all')) {
      return this.sketchDocument.pages;
    }
    return this.sketchDocument.pages
      .map(p => pages.includes(p.do_objectID) ? p : null)
      .filter(p => p !== null);
  }
}

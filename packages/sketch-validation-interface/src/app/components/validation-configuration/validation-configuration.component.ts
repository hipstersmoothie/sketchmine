import { Component, Output, EventEmitter, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ValidationService, ActiveRule } from '../../services/validation.service';
import { DocumentMetaResponseData } from '../../services/communication.service';

@Component({
  selector: 'validation-configuration',
  templateUrl: './validation-configuration.component.html',
  styleUrls: ['./validation-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationConfigurationComponent implements OnInit {
  @Input() documentMeta: DocumentMetaResponseData;
  @Input() loading: boolean = true;
  @Output() selectedRules = new EventEmitter<any>();
  rulesConfiguration: FormGroup;
  rulesConf: ActiveRule[];
  environments: string[];

  constructor(
    private fb: FormBuilder,
    private vs: ValidationService,
  ) {
    this.rulesConf = this.vs.getRules();
    this.environments = this.getEnvironments();
    this.rulesConfiguration = this.fb.group(
      {
        rules: this.buildRules(), // array of check-boxes
        env: this.fb.control('product'), // select for environment
        pages: this.fb.control('all'),
      },
      { validator: minSelectedRule },
    );

    this.setRulesForEnvironment(this.env.value);

    this.env.valueChanges.subscribe((env: string) => {
      this.setRulesForEnvironment(env);
    });
  }

  setRulesForEnvironment(env: string) {
    this.rulesConf.forEach((ruleDef) => {
      const rule = this.rules.get(ruleDef.name);
      if (!ruleDef.env.includes(env)) {
        rule.disable();
      } else {
        rule.enable();
      }
    });
  }

  get rules(): FormGroup {
    return this.rulesConfiguration.get('rules') as FormGroup;
  }

  get env(): FormControl {
    return this.rulesConfiguration.get('env') as FormControl;
  }

  get pages(): FormControl {
    return this.rulesConfiguration.get('pages') as FormControl;
  }

  private getEnvironments(): string[] {
    const environments = [];
    this.rulesConf.forEach(rule => environments.push(...rule.env));
    return Array.from(new Set(environments));
  }

  private buildRules() {
    const group = {};

    this.rulesConf.forEach((rule) => {
      if (rule.active) {
        group[rule.name] = new FormControl(rule.active);
      }
    });

    return new FormGroup(group);
  }

  startValidation() {
    const selectedRules = [];
    for (const ruleName in this.rulesConfiguration.value.rules) {
      if (this.rulesConfiguration.value.rules[ruleName]) {
        selectedRules.push(this.rulesConf.find(rule => rule.name === ruleName));
      }
    }

    const config = {
      rules: selectedRules,
      pages: this.rulesConfiguration.value.pages,
      env: this.rulesConfiguration.value.env,
    };

    this.selectedRules.emit(config);
  }

  ngOnInit() { }
}

export const minSelectedRule: ValidatorFn = (control: FormGroup, min = 1): ValidationErrors | null => {
  const rules = control.get('rules') as FormGroup;
  return Object.values(rules.value).indexOf(true) < 0 ? { minSelectedRuleError: true } : null;
};

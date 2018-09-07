import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<button dt-button="" variant="secondary">Simple button</button>`,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }']
})
export class DtButtonVariantSecondaryComponent {}

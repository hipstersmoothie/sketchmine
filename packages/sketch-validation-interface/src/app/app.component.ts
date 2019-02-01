import { Component } from '@angular/core';

@Component({
  selector: 'skm-root',
  template: '<validation class="sketch-validation-interface"></validation>',
  styles: [`
  validation {
    display: flex;
    flex-flow: column;
    height: 100vh;
  }
  `],
})
export class AppComponent {
  title = 'sketch-plugin-interface';
}

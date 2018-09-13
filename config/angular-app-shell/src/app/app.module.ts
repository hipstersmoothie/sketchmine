import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PortalModule } from '@angular/cdk/portal';
import { EXAMPLES_MAP } from './examples-registry';
import { AppComponent } from './app.component';
import { DtButtonModule, DtTileModule, DtIconModule, DtCardModule, DtThemingModule } from '@dynatrace/angular-components';

import { IconOnlyButtonExampleComponent } from './examples/button';


export const EXAMPLES = new Map<string, any>([
  ['button', IconOnlyButtonExampleComponent]
]);

@NgModule({
  declarations: [
    AppComponent,
    IconOnlyButtonExampleComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DtButtonModule,
    PortalModule,
    FormsModule,
    ReactiveFormsModule,
    DtIconModule.forRoot({ svgIconLocation: `/assets/icons/{{name}}.svg` }),
    DtTileModule,
    DtCardModule,
    DtThemingModule,
  ],
  providers: [
    { provide: EXAMPLES_MAP, useValue: EXAMPLES }
  ],
  entryComponents: [
    IconOnlyButtonExampleComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

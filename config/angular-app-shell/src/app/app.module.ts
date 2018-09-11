import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DtButtonModule, DtTileModule, DtIconModule, DtCardModule, DtThemingModule } from '@dynatrace/angular-components';

import { AppComponent } from './app.component';


import { IconOnlyButtonExampleComponent } from './examples/button-icon-only-example.component';
import { PortalModule } from '@angular/cdk/portal';



@NgModule({
  declarations: [
    AppComponent,
    IconOnlyButtonExampleComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DtButtonModule,
    PortalModule,
    DtIconModule.forRoot({ svgIconLocation: `/assets/icons/{{name}}.svg` }),
    DtTileModule,
    DtCardModule,
    DtThemingModule,
  ],
  providers: [],
  entryComponents: [
    IconOnlyButtonExampleComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

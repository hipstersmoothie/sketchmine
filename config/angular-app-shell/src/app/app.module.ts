import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DtButtonModule, DtTileModule, DtIconModule, DtCardModule, DtThemingModule } from '@dynatrace/angular-components';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { DtButtonVariantPrimaryComponent } from './examples/button-primary.component';
import { DtButtonVariantSecondaryComponent } from './examples/button-secondary.component';
import { ButtonIconComponent } from './examples/button-icon.component';

const routes: Routes = [
  {path: 'button/button--primary', component: DtButtonVariantPrimaryComponent},
  {path: 'button/button--secondary', component: DtButtonVariantSecondaryComponent},
  {path: 'button/button--icon', component: ButtonIconComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    DtButtonVariantPrimaryComponent,
    DtButtonVariantSecondaryComponent,
    ButtonIconComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DtButtonModule,
    DtIconModule.forRoot({ svgIconLocation: `/assets/icons/{{name}}.svg` }),
    DtTileModule,
    DtCardModule,
    DtThemingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

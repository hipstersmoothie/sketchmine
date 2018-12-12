import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PortalModule } from '@angular/cdk/portal';
import { EXAMPLES_MAP } from './examples-registry';
import { AppComponent } from './app.component';
import { DebugComponent } from './debug.component';

import { ExampleModule, EXAMPLES } from './examples/example.module';

@NgModule({
  declarations: [
    AppComponent,
    DebugComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PortalModule,
    FormsModule,
    ReactiveFormsModule,
    ExampleModule,
  ],
  providers: [
    { provide: EXAMPLES_MAP, useValue: EXAMPLES }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

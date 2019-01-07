import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {
  ResultItemFailingComponent,
  ValidationComponent,
  ValidationConfigurationComponent,
  ValidationResultsComponent,
} from './components';
import { FileNamePipe, ValuesPipe } from './pipes';

// Material
import {
  MatSnackBarModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatSelectModule,
  MatButtonModule,
  MatCardModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatChipsModule,
  MatDividerModule,
  MatListModule,
  MatIconModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResultMessageComponent } from './components/result-message/result-message.component';

@NgModule({
  declarations: [
    AppComponent,
    ValidationConfigurationComponent,
    ValidationComponent,
    ValidationResultsComponent,
    ResultItemFailingComponent,
    FileNamePipe,
    ValuesPipe,
    ResultMessageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

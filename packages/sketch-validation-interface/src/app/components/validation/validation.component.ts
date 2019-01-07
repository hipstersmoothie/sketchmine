import { Component, OnDestroy } from '@angular/core';
import { ColorService } from '../../services/color.service';
import { combineLatest, Subject } from 'rxjs';
import { ValidationService, CommunicationService, DocumentMetaResponseData } from '../../services';
import { ValidationConfig } from '../../interfaces';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent implements OnDestroy {
  documentMeta: DocumentMetaResponseData;
  loading = true;
  result: any[];
  destroy$ = new Subject<void>();

  constructor(
    private colorService: ColorService,
    private communicationService: CommunicationService,
    private validationService: ValidationService,
  ) {
    this.validationService.getRules();

    combineLatest(
      this.colorService.getColors(),
      this.communicationService.getDocumentMeta())
    .pipe(takeUntil(this.destroy$))
    .subscribe(([colors, docMeta]) => {
      this.validationService.colorsFile = colors;
      this.documentMeta = docMeta;
      this.loading = false;
    });
  }

  handleValidate(config: ValidationConfig) {
    this.loading = true;
    this.communicationService.getDocument()
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((document) => {
        this.documentMeta = document;
        this.validationService.sketchDocument = document;
        this.result = this.validationService.validate(config);
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

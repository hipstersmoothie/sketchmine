import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'validation-results',
  templateUrl: './validation-results.component.html',
  styleUrls: ['./validation-results.component.scss'],
})
export class ValidationResultsComponent implements OnDestroy, OnInit {

  @Input() result: any[];
  constructor() {}

  ngOnDestroy() {}

  ngOnInit() {}
}

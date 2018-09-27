import { Component, OnInit } from '@angular/core';

declare var window: any;

const timeout = ms => new Promise(res => setTimeout(res, ms));

@Component({
  selector: 'app-root',
  template: '<button dt-button>Simple button</button>',
})
export class DebugComponent implements OnInit {


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (window.sketchGenerator) {
      window.sketchGenerator.emitDraw(`button`)
        .then(() => window.sketchGenerator.emitFinish());
    }
  }
}

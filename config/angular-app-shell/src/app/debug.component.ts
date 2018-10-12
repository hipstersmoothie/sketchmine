import { Component, OnInit } from '@angular/core';
import { waitForDraw } from './app.component';

declare var window: any;

@Component({
  selector: 'app-root',
  template: '<button dt-button>Simple button</button>',
})
export class DebugComponent implements OnInit {


  ngOnInit(): void {
    handleDraw('button').then();
  }
}


async function handleDraw(comp: string) {
  if (!window.sketchGenerator) {
    return;
  }
  await waitForDraw();
  await window.sketchGenerator.emitDraw(comp);
  await window.sketchGenerator.emitFinish();
}

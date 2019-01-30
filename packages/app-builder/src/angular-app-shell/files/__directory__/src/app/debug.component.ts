import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { waitForDraw } from './utils';
import { MetaService } from './meta.service';
import { ViewData } from '@angular/core/src/view'; // not exported from core (only for POC)
import { checkSubComponents } from './check-sub-components';
import { Subscription } from 'rxjs';
import { Component as MetaComponent } from '@sketchmine/code-analyzer/lib/@types';

declare var window: any;

@Component({
  selector: 'app-root',
  template: '<button dt-button>Simple button</button>',
})
export class DebugComponent implements OnInit, OnDestroy {

  metaSubscription: Subscription;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _metaService: MetaService,
  ) { }

  ngOnInit(): void {
    this.metaSubscription = this._metaService.getMeta()
    .subscribe(async (components: MetaComponent[]) => {
      const view = (this._viewContainerRef as any)._data.componentView as ViewData;
      checkSubComponents(view, components, components[0]);
      handleDraw('button').then();
    });
  }

  ngOnDestroy(): void {
    this.metaSubscription.unsubscribe();
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

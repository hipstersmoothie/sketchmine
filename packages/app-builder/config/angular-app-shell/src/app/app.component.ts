import { Component, Type, ViewChild, ViewContainerRef, OnInit, OnDestroy, ComponentRef, SimpleChange } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ViewData } from '@angular/core/src/view'; // not exported from core (only for POC)
import { MetaService } from './meta.service';
import {
  Component as MetaComponent,
  Variant as MetaVariant,
  VariantMethod as MetaVariantMethod,
  VariantProperty as MetaVariantProperty,
} from '@sketchmine/code-analyzer';
import { ExamplesRegistry } from './examples-registry';
import { checkSubComponents } from './check-sub-components';
import { Subscription } from 'rxjs';

declare var window: any;

async function asyncForEach(array, callback) {
  for (let i = 0, max = array.length; i < max; i += 1) {
    await callback(array[i], i, array)
  }
}

export function waitForDraw(): Promise<void> {
  return new Promise((res) => {
    // Timout as Fallback if the requestIdleCallback needs longer than 5sec
    const timeoutId = setTimeout(res, 5000);
    /** @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback */
    window.requestIdleCallback(() => {
      clearTimeout(timeoutId);
      res();
    });
  });
}

@Component({
  selector: 'app-root',
  template: '<div cdkPortalOutlet></div>',
})
export class AppComponent implements OnInit, OnDestroy {

  metaSubscription: Subscription;
  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;
  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _metaService: MetaService,
    private _registry: ExamplesRegistry,
  ) { }

  ngOnInit() {
    this.metaSubscription = this._metaService.getMeta()
    .subscribe(async (components: MetaComponent[]) => {
      await asyncForEach(components, async (componentMeta: MetaComponent) => {
        await asyncForEach(componentMeta.variants, async (variant:MetaVariant) => {
          await this._applyChange(componentMeta, variant, components);
        });
      });

      if (window.sketchGenerator) {
        await window.sketchGenerator.emitFinish();
      }
    });
  }

  ngOnDestroy(): void {
    this.metaSubscription.unsubscribe();
  }

  private async _applyChange(componentMeta: MetaComponent, variant: MetaVariant, components: MetaComponent[]) {
    const exampleType = this._registry.getExampleByName(componentMeta.component);
    if (!exampleType) {
      return;
    }
    const exampleComponentRef = this._instanceComponent(exampleType);
    const componentInstances = this._getCompInstances(componentMeta, exampleComponentRef);

    exampleComponentRef.changeDetectorRef.detectChanges();

    await asyncForEach(variant.changes, async (change: MetaVariantMethod | MetaVariantProperty) => {
    if (change.type === 'property') {
        await asyncForEach(componentInstances, async (instance) => {
          const value = (change.value === 'undefined') ? undefined : JSON.parse(change.value);
          const oldvalue = instance[change.key];
          instance[change.key] = value;
          if (instance.ngOnChanges) {
            instance.ngOnChanges({
              [change.key]: new SimpleChange(oldvalue, value, false)
            });
          }
          // if (window.sketchGenerator) {
          //   const el = instance._elementRef.nativeElement as HTMLElement;
          //   const selector = `${el.tagName}[class="${el.getAttribute('class')}"]`;
          //   await window.sketchGenerator.emitClick(selector);
          // }
        });
      }
    });

    exampleComponentRef.changeDetectorRef.detectChanges();

    // detect child angular components and annotate the variant in the tree
    const view = (exampleComponentRef.hostView as any)._view.nodes[0].componentView as ViewData;
    checkSubComponents(view, components, componentMeta);

    // wait for browser draw
    await waitForDraw();
    if (window.sketchGenerator) {
      await window.sketchGenerator.emitDraw(variant.name);
    }
  }

  private _getCompInstances<C>(componentMeta: MetaComponent, exampleComponentRef: ComponentRef<C>) {
    const componentInstances = [];
    componentMeta.selector.forEach((selector: string) => {
      const exampleElement = exampleComponentRef.location.nativeElement.querySelector(selector);
      const compInstance = findComponentInstance(exampleComponentRef, exampleElement);
      if (compInstance) {
        componentInstances.push(compInstance);
      }
    });

    return componentInstances;
  }

  private _instanceComponent<C>(exampleType: Type<C>) {
    if (this.portalOutlet.hasAttached()) {
      this.portalOutlet.detach();
    }
    const portal = new ComponentPortal(exampleType, this._viewContainerRef);
    return this.portalOutlet.attachComponentPortal(portal);
  }
}

/**
   * find the instance in the hidden view of Angular for an example
   * the button has a wrapper arround and the true button instance where we have to apply
   * the properties is somewhere in the dom
   * @param ref ComponentRef
   * @param element the HTMLelement we should find
   */
export function findComponentInstance<E, C>(ref: ComponentRef<E>, element: HTMLElement): Type<C> | null {
    const rootView = (ref.hostView as any)._view as ViewData;

    function findInNodes(view: ViewData) {
      if (view.nodes) {
        for (const node of view.nodes as any[]) {
          if (node && node.renderElement) {
            if (node.renderElement === element && node.componentView) {
              return node.componentView.component || null;
            }
            if (node.componentView) {
              return findInNodes(node.componentView);
            }
          }
        }
      }
      return null;
    }

    if (rootView) {
      return findInNodes(rootView) || null;
    }

    return null;
  }

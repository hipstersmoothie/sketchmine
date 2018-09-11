import { Component, ComponentFactoryResolver, ApplicationRef, Injector, Type, ViewChild, ViewContainerRef, OnInit, ComponentRef } from '@angular/core';
import { DomPortalHost, CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { forEach } from '@angular/router/src/utils/collection';
import { IconOnlyButtonExampleComponent } from './examples/button-icon-only-example.component';
import { take } from 'rxjs/operators';
import { ViewData } from '@angular/core/src/view';


declare var window: any;
const meta = {
  button: {
    className: 'DtButton',
    component: 'button',
    location: '/Users/lukas.holzer/Sites/test/ng-sketch/src/angular-meta-parser/_tmp/src/lib/button/button.ts',
    selector: [
      'button[dt-button]',
      'button[dt-icon-button]',
    ],
    clickable: false,
    hoverable: false,
    variants: [
      {
        name: 'dt-button-disabled',
        changes: [
          {
            type: 'property',
            key: 'disabled',
            value: 'true',
          },
        ],
      },
      {
        name: 'dt-button-color-main',
        changes: [
          {
            type: 'property',
            key: 'color',
            value: '"main"',
          },
        ],
      },
      {
        name: 'dt-button-color-accent',
        changes: [
          {
            type: 'property',
            key: 'color',
            value: '"accent"',
          },
        ],
      },
      {
        name: 'dt-button-color-warning',
        changes: [
          {
            type: 'property',
            key: 'color',
            value: '"warning"',
          },
        ],
      },
      {
        name: 'dt-button-color-error',
        changes: [
          {
            type: 'property',
            key: 'color',
            value: '"error"',
          },
        ],
      },
      {
        name: 'dt-button-color-cta',
        changes: [
          {
            type: 'property',
            key: 'color',
            value: '"cta"',
          },
        ],
      },
      {
        name: 'dt-button-color-undefined',
        changes: [
          {
            type: 'property',
            key: 'color',
            value: 'undefined',
          },
        ],
      },
      {
        name: 'dt-button-variant-primary',
        changes: [
          {
            type: 'property',
            key: 'variant',
            value: '"primary"',
          },
        ],
      },
      {
        name: 'dt-button-variant-secondary',
        changes: [
          {
            type: 'property',
            key: 'variant',
            value: '"secondary"',
          },
        ],
      },
      {
        name: 'dt-button-variant-nested',
        changes: [
          {
            type: 'property',
            key: 'variant',
            value: '"nested"',
          },
        ],
      },
    ],
  },
};

async function asyncForEach(array, callback) {
  for (let i = 0, max = array.length; i < max; i += 1) {
    await callback(array[i], i, array)
  }
}


const timeout = ms => new Promise(res => setTimeout(res, ms))

@Component({
  selector: 'app-root',
  template: '<div cdkPortalOutlet></div>',
  styles: [''],
})
export class AppComponent implements OnInit{

  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;
  constructor( private _viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    asyncForEach(Object.values(meta), async (componentMeta) => {
      await asyncForEach(componentMeta.variants, async (variant) => {
        await this._applyChange(componentMeta, variant);
      });
    });
  }

  private async _applyChange(componentMeta, variant) {
    const exampleComponentRef = this._instanceComponent(IconOnlyButtonExampleComponent);
    const componentInstances = this._getCompInstances(componentMeta, exampleComponentRef);

    variant.changes.forEach(change => {
      if (change.type === 'property') {
        componentInstances.forEach((instance) => {
          instance[change.key] = (change.value === 'undefined') ? undefined : JSON.parse(change.value);
        });
      }
    });

    exampleComponentRef.changeDetectorRef.detectChanges();
    // wait for browser draw
    await timeout(0);
    // TODO
    // await window.sketchGenerator.emitDraw(variant.name);
  }

  private _getCompInstances(componentMeta, exampleComponentRef) {
    const componentInstances = [];
    componentMeta.selector.forEach((selector) => {
      const exampleElement = exampleComponentRef.location.nativeElement.querySelector(selector);
      const compInstance = this._findComponentInstance(exampleComponentRef, exampleElement);
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

  /**
   * find the instance in the hidden view of Angular for an example
   * the button has a wrapper arround and the true button instance where we have to apply
   * the properties is somewhere in the dom
   * @param ref ComponentRef
   * @param element the HTMLelement we should find
   */
  private _findComponentInstance<E, C>(ref: ComponentRef<E>, element: HTMLElement): Type<C> | null {
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

}

import { Type, ComponentRef } from '@angular/core';
import { ViewData } from '@angular/core/src/view'; // not exported from core (only for POC)

/**
   * find the instance in the hidden view of Angular for an example
   * the button has a wrapper around and the true button instance where we have to apply
   * the properties is somewhere in the dom
   * @param ref ComponentRef
   * @param element the HTMLElement we should find
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

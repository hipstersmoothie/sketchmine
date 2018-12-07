import { Type } from '@angular/core';
import {
  Component as MetaComponent,
  VariantProperty as MetaVariantProperty,
} from '@sketchmine/code-analyzer/lib/@types';
import { generateVariantName } from './generate-variant-name';
import { ViewData, ElementData } from '@angular/core/src/view'; // not exported from core (only for POC)

export function checkSubComponents(viewData: ViewData, components: MetaComponent[], current: MetaComponent) {
  for (const key in viewData.nodes) {
    if (!viewData.nodes.hasOwnProperty(key) || !viewData.nodes[key]) {
      continue;
    }
    const node: ElementData = viewData.nodes[key] as any;
    if (!node.componentView) {
      continue;
    }

    const selectors = getComponentInstanceSelector(node.componentView.component)

    // if the selectors array matches the selectors of the current then continue
    // the root Element is not interesting for detecting the variant
    if (current.selector.every(el => selectors.indexOf(el) > -1)) {
      continue;
    }

    // find the matching dynatrace component from the meta infromation
    const comp = components.find(component => component.selector.every(el => selectors.indexOf(el) > -1));

    // we only want dynatrace angular components
    if (!comp) {
      continue;
    }


    const changes: MetaVariantProperty[] = []
    comp.properties.forEach((prop) => {

      const value = node.componentView.component[prop];
  
      if (value) {
        changes.push({
          type: 'property',
          key: prop,
          value: JSON.stringify(value),
        });
      }
    });
    node.renderElement.setAttribute('symbol-variant', generateVariantName(comp.component, changes));
  }
}


/** TODO: This is only for the POC needs to be rewritten cleanly later */
export function getComponentInstanceSelector<C>(component: Type<C>): string[] {
  const selectors: string[] = [];
  const decorators = (component as any).__proto__.constructor.decorators;
  if (decorators.length) {

    decorators.forEach(decorator => {
      if (decorator.hasOwnProperty('args')) {
        decorator.args.forEach(props => {
          if (props.hasOwnProperty('selector')) {
            selectors.push(...props.selector.split(',').map(sel => sel.trim()));
          }
        })
      }

    });
  }
  return selectors;
}

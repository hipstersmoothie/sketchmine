import { Type } from '@angular/core';
import {
  Component as MetaComponent,
  Property as MetaProperty,
  Method as MetaMethod,
} from '@sketchmine/code-analyzer/lib/@types';
import { generateVariantName } from './utils';
import { ViewData, ElementData } from '@angular/core/src/view'; // not exported from core (only for POC)
import { VariantChange } from './app.component';

export function checkSubComponents(
  viewData: ViewData,
  components: MetaComponent[],
  current: MetaComponent,
  currentTheme: string,
): void {
  for (const key in viewData.nodes) {
    // node can be undefined as well so check that!
    if (!viewData.nodes.hasOwnProperty(key) || !viewData.nodes[key]) {
      continue;
    }

    const node: ElementData = viewData.nodes[key] as any;
    // We are only interested in the component view
    if (!node.componentView) {
      continue;
    }

    // if the componentView has some child nodes we need a recursive call to check the child nodes as well…
    if (node.componentView.nodes) {
      checkSubComponents(node.componentView, components, current, currentTheme);
    }

    const selectors = getComponentInstanceSelector(
      node.componentView.component,
    );

    // if the selectors array matches the selectors of the current then continue
    // the root Element is not interesting for detecting the variant
    if (current.selector.every(el => selectors.indexOf(el) > -1)) {
      continue;
    }

    // find the matching dynatrace component from the meta information
    const comp = components.find(component =>
      component.selector.every(el => selectors.indexOf(el) > -1),
    );

    // we only want dynatrace angular components
    if (!comp) {
      continue;
    }

    const variant = getVariant(node.componentView.component, comp, currentTheme) || comp.component;

    node.renderElement.setAttribute('symbol-variant', variant);
  }
}

/**
 * @description
 * Generates the name of the current variant that is used by the nested symbol
 * @param instance Found nested component instance of a dynatrace angular component
 * @param component The matched component in the JSON
 */
export function getVariant(
  instance: any,
  component: MetaComponent,
  currentTheme: string,
): string | undefined {
  if (!instance) {
    return;
  }

  const changes: VariantChange[] = [];

  component.members.forEach((member: MetaMethod | MetaProperty) => {
    if (member.type === 'property') {
      const value = instance[member.key];

      // check if the instance has a property set with this value
      if (value) {
        changes.push({
          type: 'property',
          key: member.key,
          value: JSON.stringify(value),
        });
      }
    }
  });

  return generateVariantName(component.component, currentTheme, changes);
}

export function getComponentInstanceSelector<C>(component: Type<C>): string[] {
  const selectors: string[] = [];
  const decorators = (component as any).__proto__.constructor.decorators;
  if (decorators.length) {
    decorators.forEach((decorator) => {
      if (decorator.hasOwnProperty('args')) {
        decorator.args.forEach((props) => {
          if (props.hasOwnProperty('selector')) {
            selectors.push(...props.selector.split(',').map(sel => sel.trim()));
          }
        });
      }
    });
  }
  return selectors;
}

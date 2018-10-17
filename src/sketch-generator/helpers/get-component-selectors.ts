import { AMP } from '@angular-meta-parser/meta-information';

export function getComponentSelectors(meta: AMP.Result): string[] {
  const selectors = [];

  if (!meta) {
    return selectors;
  }

  for (const comp in meta.components) {
    if (meta.components.hasOwnProperty(comp)) {
      const component = meta.components[comp];
      selectors.push(...component.selector);
    }
  }

  return selectors;
}

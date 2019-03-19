import { Library } from '@sketchmine/code-analyzer';

export function getComponentSelectors(meta: Library): string[] {
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

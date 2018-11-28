import { Result as MetaResult } from '@sketchmine/code-analyzer';

export function getComponentSelectors(meta: MetaResult): string[] {
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

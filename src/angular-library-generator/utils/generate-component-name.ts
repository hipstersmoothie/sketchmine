import { kebabCaseToCamelCase, capitalizeFirstLetter } from '@utils';

export function generateClassName(name: string): string {
  return capitalizeFirstLetter(kebabCaseToCamelCase(`${name}-component`));
}

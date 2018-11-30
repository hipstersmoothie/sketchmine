import { capitalizeFirstLetter } from '@sketchmine/helpers';
import { camelCase } from 'lodash-es';

export function generateClassName(name: string): string {
  return capitalizeFirstLetter(camelCase(`${name}-component`));
}

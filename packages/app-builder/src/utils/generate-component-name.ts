import { capitalizeFirstLetter } from '@sketchmine/helpers';
import { camelCase } from 'lodash';

export function generateClassName(name: string): string {
  return capitalizeFirstLetter(camelCase(`${name}-component`));
}

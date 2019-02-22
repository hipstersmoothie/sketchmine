import { SketchObjectTypes } from '@sketchmine/sketch-file-format';
import { IValidationContext } from '../../src/interfaces/validation-rule.interface';

/**
 * To create a new validation error object, at least an objectID and a name is needed.
 * This minimum fixture provides those two properties and a Sketch object type (_class)
 * and can be used when no other properties are required for a test.
 */
export function generateMinimumTaskFixture(
  name = 'Rectangle',
  objectType = SketchObjectTypes.Rectangle,
): IValidationContext {
  return {
    _class: objectType,
    do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
    name,
  } as IValidationContext;
}

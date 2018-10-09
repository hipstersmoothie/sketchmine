import { Property } from '../ast/json-visitor';
import { variantCombinationGenerator } from './variant-combination-generator';

const BUTTON_VARIANTS: Property[] = [
  { type: 'property', key: 'disabled', value: ['true'] },
  { type: 'property', key: 'color', value: ['"main"', '"warning"', '"cta"'] },
  { type: 'property', key: 'variant', value: ['"primary"', '"secondary"'] },
];

describe('[angular-meta-parser] › utils › generate variants', () => {

  test('mutating two properties', () => {

    const testVariants: Property[] = [
      { type: 'property', key: 'disabled', value: ['true'] },
      { type: 'property', key: 'color', value: ['"main"'] },
    ];

    const result = variantCombinationGenerator('DtButton', ...testVariants);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual(
      expect.objectContaining({
        name: 'button/main/disabled',
        changes: [
          expect.objectContaining({
            type: 'property',
            key: 'disabled',
            value: 'true',
          }),
          expect.objectContaining({
            type: 'property',
            key: 'color',
            value: '"main"',
          }),
        ],
      }),
    );
    expect(result).toContainEqual(
      expect.objectContaining({
        name: 'button/disabled',
        changes: [
          expect.objectContaining({
            type: 'property',
            key: 'disabled',
            value: 'true',
          }),
        ],
      }),
    );
    expect(result).toContainEqual(
      expect.objectContaining({
        name: 'button/main/default',
        changes: [
          expect.objectContaining({
            type: 'property',
            key: 'color',
            value: '"main"',
          }),
        ],
      }),
    );
  });

  test('permutate all the button variants', () => {
    const result = variantCombinationGenerator('DtButton', ...BUTTON_VARIANTS);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(23);

    const variants = result.map(r => r.name);
    expect(variants).toContain('button/cta/default');
    expect(variants).toContain('button/cta/disabled');
    expect(variants).toContain('button/cta/primary/default');
    expect(variants).toContain('button/cta/primary/disabled');
    expect(variants).toContain('button/cta/secondary/default');
    expect(variants).toContain('button/cta/secondary/disabled');
    expect(variants).toContain('button/disabled');
    expect(variants).toContain('button/main/default');
    expect(variants).toContain('button/main/disabled');
    expect(variants).toContain('button/main/primary/default');
    expect(variants).toContain('button/main/primary/disabled');
    expect(variants).toContain('button/main/secondary/default');
    expect(variants).toContain('button/main/secondary/disabled');
    expect(variants).toContain('button/primary/default');
    expect(variants).toContain('button/primary/disabled');
    expect(variants).toContain('button/primary/warning/default');
    expect(variants).toContain('button/primary/warning/disabled');
    expect(variants).toContain('button/secondary/default');
    expect(variants).toContain('button/secondary/disabled');
    expect(variants).toContain('button/secondary/warning/default');
    expect(variants).toContain('button/secondary/warning/disabled');
    expect(variants).toContain('button/warning/default');
    expect(variants).toContain('button/warning/disabled');
  });
});

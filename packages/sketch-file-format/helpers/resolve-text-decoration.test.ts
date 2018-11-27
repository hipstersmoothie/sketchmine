import { resolveTextDecoration } from './resolve-text-decoration';

describe('[sketch-generator] › helpers › resolve text decoration', () => {
  test('resolve line through solid', () => {
    const textDecoration = resolveTextDecoration('line-through solid rgba(0, 0, 0, 0.87)');
    expect(textDecoration).toMatchObject(expect.objectContaining({
      type: 'line-through',
      style: 'solid',
      color: expect.objectContaining({
        r: 0,
        g: 0,
        b: 0,
        a: expect.any(Number),
      }),
    }));
    expect(textDecoration.color.a).toBeCloseTo(0.87);
  });

  test('text decoration none', () => {
    const textDecoration = resolveTextDecoration('none solid rgba(0, 0, 0, 0.87)');
    expect(textDecoration).toBeNull();
  });

  test('text decoration custom type', () => {
    const textDecoration = resolveTextDecoration('custom-type solid rgba(0, 0, 0, 0.87)');
    expect(textDecoration.type).toMatch(/custom-type/);
  });
});

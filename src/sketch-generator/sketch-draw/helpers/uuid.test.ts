import { UUID } from './uuid';

describe('[sketch-generator] › UUID generation format', () => {

  test('if the generated ID matches the format of RFC4122 in version 4', () => {
    /**
     * The 4 in the third group is important for the version 4 compliance
     * otherwise any word character or digit is important
     */
    const regex = /[\d\w]{8}-[\d\w]{4}-4[\d\w]{3}-[\d\w]{4}-[\d\w]{12}/;
    expect(UUID.generate()).toMatch(regex);
  });
});

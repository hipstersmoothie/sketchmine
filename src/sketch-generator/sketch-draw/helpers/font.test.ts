import { convertTextAlign } from './font';

describe('[sketch-generator] › helpers › fonts', () => {

  it('should convert text-align numbers to correct numbers', () => {
    expect(convertTextAlign('left')).toBe(0);
    expect(convertTextAlign('right')).toBe(1);
    expect(convertTextAlign('center')).toBe(2);
    expect(convertTextAlign('justified')).toBe(3);
  });
});

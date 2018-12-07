import { convertTextAlign, fontMapping, convertFontWeightToNumber } from '../src/helpers';

describe('[sketch-generator] › helpers › fonts', () => {

  it('should convert text-align numbers to correct numbers', () => {
    expect(convertTextAlign('left')).toBe(0);
    expect(convertTextAlign('right')).toBe(1);
    expect(convertTextAlign('center')).toBe(2);
    expect(convertTextAlign('justified')).toBe(3);
  });

  it('should get the correct font mapped for regular font', () => {
    const font = fontMapping('BerninaSansWeb', '400', 'normal');
    expect(font).toMatch('BerninaSans');
  });

  it('should get the correct font mapped for light italic', () => {
    const font = fontMapping('BerninaSansWeb', '300', 'italic');
    expect(font).toMatch('BerninaSans-LightItalic');
  });

  it('should get the correct font mapped for extra bold italic', () => {
    const font = fontMapping('BerninaSansWeb', '900', 'italic');
    expect(font).toMatch('BerninaSans-ExtraboldItalic');
  });

  it('should get the correct font mapped for extra bold but written in textform - italic', () => {
    const font = fontMapping('BerninaSansWeb', 'bolder', 'italic');
    expect(font).toMatch('BerninaSans-ExtraboldItalic');
  });

  it('should get the correct font mapped for regular font without weight', () => {
    const font = fontMapping('BerninaSansWeb', '400');
    expect(font).toMatch('BerninaSans');
  });

  it('should get the correct font mapped for any other font', () => {
    const font = fontMapping('Lustige Font zum Testen', '400', 'italic');
    expect(font).toMatch('Lustige Font zum Testen');
  });

  it('should convert the word bolder to 900', () => {
    expect(convertFontWeightToNumber('bolder')).toEqual(900);
  });

  it('should convert the word lighter to 200', () => {
    expect(convertFontWeightToNumber('lighter')).toEqual(200);
  });

  it('should convert the word inherit to 400', () => {
    expect(convertFontWeightToNumber('inherit')).toEqual(400);
  });
});

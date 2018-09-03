import { Sketch } from './sketch';
jest.mock('./sketch');

describe('Sketch file format generation', () => {

  describe('Folder structure', () => {
    let sketch: Sketch;

    beforeEach(() => {
      sketch = new Sketch();
    });

    it('should have created the Sketch class and called the write function', async () => {
      expect(Sketch).toHaveBeenCalledTimes(1);
      await sketch.write([]);
      expect(sketch.write).toHaveBeenCalledTimes(1);
      expect(sketch.write).toHaveBeenCalledWith([]);
      expect(sketch.write).toHaveReturned(); /** check that the function does not throw */
    });
  });

});

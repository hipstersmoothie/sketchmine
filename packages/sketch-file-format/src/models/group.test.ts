import { Group } from './group';
import { IBounding } from '../interfaces';
jest.mock('./group');

describe('Sketch file format generation', () => {

  describe('Folder structure', () => {
    const bounding: IBounding = { width: 100, height: 100, x: 100, y: 100 };

    beforeEach(() => {
      (Group as any).mockClear();
    });

    it('should check if the constructor was called', () => {
      const group: jest.Mocked<Group> = new Group(bounding) as any;
      expect(Group).toHaveBeenCalledTimes(1);
    });

    it('should check generate Object was called', () => {
      expect(Group).not.toHaveBeenCalled();
      const group: jest.Mocked<Group> = new Group(bounding) as any;
      expect(Group).toHaveBeenCalledTimes(1);
      const output = group.generateObject();
      expect(group.generateObject).toHaveBeenCalled();
      expect(group.generateObject).toHaveReturned();
    });

  });
});

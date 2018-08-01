import { exec } from 'child_process';

// TODO: have to update this test! according to new build system
describe('➡ Sketch File Validation', () => {

  describe('Validating sample file', () => {
    it('Should fail the validation', (done) => {
      const child = exec('ts-node src/validate/index.ts --file=tests/fixtures/name-validation-test.sketch');
      child.on('exit', (data) => {
        expect(data).toEqual(1);
        done();
      });
    });

    it('Should pass the validation', (done) => {
      const child = exec('ts-node src/validate/index.ts --file=tests/fixtures/all-fine-validation.sketch');
      child.on('exit', (data) => {
        expect(data).toEqual(0);
        done();
      });
    });
  });
});

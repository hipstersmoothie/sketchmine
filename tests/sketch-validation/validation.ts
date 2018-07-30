import { expect } from 'chai';
import { exec } from 'child_process';

describe('➡ Sketch File Validation', () => {

  context('Validating sample file', () => {
    it('Should fail the validation', (done) => {
      const child = exec('ts-node src/validate/index.ts --file=tests/fixtures/name-validation-test.sketch');
      child.on('exit', (data) => {
        expect(data).to.equal(1);
        done();
      });
    });

    it('Should pass the validation', (done) => {
      const child = exec('ts-node src/validate/index.ts --file=tests/fixtures/all-fine-validation.sketch');
      child.on('exit', (data) => {
        expect(data).to.equal(0);
        done();
      });
    });
  });
});

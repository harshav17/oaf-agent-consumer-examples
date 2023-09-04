import { expect } from 'chai';
import { executeCode } from '../src/sudoku_solve/funcs';

describe('executeCode method', () => {
  it('should execute the code correctly', async () => {
    const result = await executeCode({ code: '(() => 2 + 3)()' });
    console.log(result);
    expect(result).to.equal(5);
  });
});

import { validateSolution } from '../src/sudoku_solve/funcs';

import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;
describe('My math library', () => {

  it('should be false when the solution is empty' , () => {
    expect(validateSolution({solution: ""})).to.equal("no solution provided");
  });
  it('should be false when the solution is invalid' , () => {
    expect(validateSolution({solution: "1,*,*,1|*,*,*,*|*,*,*,*|*,*,*,*"})).to.equal("duplicate digits in row 1,*,*,1");
  });
  it('should be true when the solution is half way through' , () => {
    expect(validateSolution({solution: "1,*,*,*|*,*,*,*|*,*,*,*|*,*,*,*"})).to.equal("");
  });
  it('should be true when the solution is half way through' , () => {
    expect(validateSolution({solution: "2,*,*,6,*,5|*,*,6,*,1,2|*,5,1,*,*,3|3,*,4,*,*,6|*,3,5,*,*,1|*,*,2,*,3,4"})).to.equal("");
  });
  it('should be true when the solution is valid' , () => {
    expect(validateSolution({solution: "1,2,3,4,5,6|4,5,6,1,2,3|2,1,4,3,6,5|3,6,5,2,1,4|5,3,1,6,4,2|6,4,2,5,3,1"})).to.equal("");
  });
  it('should be false when repetitions in the same row' , () => {
    expect(validateSolution({solution: "1,2,3,4,5,5|4,5,6,1,2,3|2,1,4,3,6,5|3,6,5,2,1,4|5,3,1,6,4,2|6,4,2,5,3,1"})).to.equal("duplicate digits in row 1,2,3,4,5,5");
  });
  it('should be true when the solution is valid' , () => {
    expect(validateSolution({solution: "1,2,3,4,5,6|4,5,6,1,2,3|2,1,4,3,5,6|3,6,5,2,1,4|5,3,1,6,4,2|6,4,2,5,3,1"})).to.equal("duplicate digits in column 4");
  });
  it('whats wrong with this' , () => {
    expect(validateSolution({solution: "2,3,*,1,4,5|*,*,6,*,1,2|*,5,1,*,*,3|3,*,4,*,*,6|*,3,5,*,*,1|*,*,2,*,3,4"})).to.equal("duplicate digits in column 1");
  });
  it('9x9 solved by code interpretor', () => {
    expect(validateSolution({solution: "3,4,2,9,8,1,5,6,7|5,7,6,2,3,4,8,1,9|8,9,1,7,5,6,2,4,3|9,2,5,4,6,3,7,8,1|4,6,8,1,2,7,3,9,5|1,3,7,8,9,5,6,2,4|6,5,4,3,1,2,9,7,8|7,8,3,6,4,9,1,5,2|2,1,9,5,7,8,4,3"})).to.equal("");
  })
});
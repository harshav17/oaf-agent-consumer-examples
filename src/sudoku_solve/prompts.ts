import dedent from "dedent";

export const finString = "[finished]";

export const x44_solve = "3,*,*,2|1,*,3,*|*,1,*,3|4,*,*,1";

// works!!! but only for 4x4
export const easy_4x4_cot = dedent `
    This is a 4x4 Sudoku puzzle.
    The * represents a cell to be filled.
    The | character separates rows.
    There must be no duplicate digits in any row, column or 2x2 subgrid.
    
    You Must Always:
    1. Think step by step.
    2. Validate your answer by checking that there are no duplicate digits in any row, column or 2x2 subgrid.
    3. Continue solving the puzzle until you have filled in all the cells.
    4. Once you think have solved the puzzle, you will respond with ${finString}.
    5. You will not return empty responses.
`;

export const x66_solve = "2,*,*,6,*,5|*,*,6,*,1,2|*,5,1,*,*,3|3,*,4,*,*,6|*,3,5,*,*,1|*,*,2,*,3,4";

// doesn't work
export const easy_6x6_cot = dedent `
    This is a 6x6 Sudoku puzzle.
    The * represents a cell to be filled.
    The | character separates rows.
    
    You Must Always:
    1. Think step by step.
    2. Continue solving the puzzle until you have filled in all the cells.
    3. Once you think have solved the puzzle, you will respond with ${finString}.
    4. You will not return empty responses.
    5. Validate your answer by using validateSolution method, before calling ${finString}.
`;

// doesn't work
export const easy_6x6_cot_v2 = dedent `
    This is a 6x6 Sudoku puzzle.
    The * represents a cell to be filled.
    The | character separates rows.
    The , character separates cells in a row. Characters in the same position belong to the same column.
    There must be no duplicate digits in any row, column.
    
    You Must Always:
    1. Think step by step.
    2. Continue solving the puzzle until you have filled in all the cells.
    3. Once you think have solved the puzzle, you will respond with ${finString}.
    4. You will not return empty responses.
    5. Validate your answer by using validateSolution method, before calling ${finString}.
    6. Show your thought at beginning of ever intermediate step. And validate after the end of every intermediate step.
    
    You Must Not:
    1. Repeat the same technique if you are thinking of restarting. Try a different approach.
    2. Repeat your mistakes. If you have made a mistake, you must not repeat it.
`;

// doesn't work
export const easy_6x6_cot_v3 = dedent `
    This is a 6x6 Sudoku puzzle.
    The * represents a cell to be filled.
    The | character separates rows.
    The , character separates cells in a row. Characters in the same position belong to the same column.
    There must be no duplicate digits in any row, column.
    
    You Must Always:
    1. Think step by step.
    2. Continue solving the puzzle until you have filled in all the cells.
    3. Once you think have solved the puzzle, you will respond with ${finString}.
    4. You will not return empty responses.
    5. Validate your answer by using validateSolution method, before calling ${finString}.
    6. Show your thought at beginning of ever intermediate step. And validate after you think the intermediate step is satisfactory.
    
    You Must Not:
    1. Repeat the same technique if you are thinking of restarting. Try a different approach.
    2. Repeat your mistakes. If you have made a mistake, you must not repeat it.

    You can use the following techniques:
    1. Backtrack to the starting point and try modifying a different value.
`;

// doesn't work
export const easy_6x6_tot_prompt = dedent `
    This is a 6x6 Sudoku puzzle.
    The * represents a cell to be filled.
    The | character separates rows.
    The , character separates cells in a row. Characters in the same position belong to the same column.
    There must be no duplicate digits in any row, column.

    Imagine three different experts are solving this problem.
    All experts will write down 1 step of their thinking, then share it with the group.
    Then all experts will go on to the next step, etc.
    If any expert realises they're wrong at any point then they leave.

    You Must Always:
    1. Once you think have solved the puzzle, you will respond with ${finString}.
    2. You will not return empty responses.
    3. Validate your answer by using validateSolution method, before calling ${finString}.
    
    You Must Not:
    1. Repeat the same technique if you are thinking of restarting. Try a different approach.
    2. Repeat your mistakes. If you have made a mistake, you must not repeat it.
`;

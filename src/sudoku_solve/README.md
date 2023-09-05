## 4x4 
for GPT-4, solving 4x4 so is a piece of cake. I used COT prompting, you probably don't even need that.
```
DEBUG=oaf:* npx ts-node src/sudoku_solve/4x4_0cot.ts
```

## 9x9
9x9 is a little tougher. Tried a zero-shot COT, zero-shot Plan and Solve, both techniques failed by themselves.
But zero-shot Plan and Solve w/ Code Interpretor capabilities solved the problem.

```
DEBUG=oaf:* npx ts-node src/sudoku_solve/9x9_0ps_w_ci.ts
```

NOTE: For 9x9, GPT-4 doesn't seem to be very good at generating JS code, so it might get stuck is code-generation-debugging-generated-code loop. Would be nice to make this more resilient.

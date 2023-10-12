import { OafOptions, callOaf } from "oaf-agent";
import { Writable } from "node:stream";
import dedent from "dedent";
import { executeCode, functionsForModel, validateSolution } from "./funcs";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { ClientOptions } from "openai";

const clientOptions: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
};

const finString = "[finished]";
export const x66_solve = "*,*,2,*,*,*,5,*,7|*,7,6,2,3,*,*,*,9|8,*,1,*,*,*,*,4,*|*,*,*,*,6,*,*,*,*|4,*,*,1,*,7,*,*,*|*,3,*,*,9,5,*,*,4|6,*,*,*,*,*,*,*,*|*,*,*,*,4,9,1,5,*|2,*,*,5,*,8,4,3,*";
export const easy_6x6_cot_v3 = dedent `
    This is a 9x9 Sudoku puzzle.
    The * represents a cell to be filled.
    The | character separates rows.
    The , character separates cells in a row. Characters in the same position belong to the same column.
    There must be no duplicate digits in any row, column or 3x3 subgrid.

    Let's first understand the problem and devise a plan to solve the problem. Then, let's carry out the plan and solve the problem step by step.

    Once you think have solved the puzzle, you will respond with ${finString}.
`;

async function main() {
    let messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: easy_6x6_cot_v3,
        },
        {
            role: "user",
            content: x66_solve,
        },
    ];
    const stream = new Writable({
        write(chunk, encoding, callback) {
            // print without newline
            process.stdout.write(chunk.toString());
            callback();
        },
    });
    stream.on('error', (err) => {
        console.error(err);
    });

    const funcs: Record<string, (...args: any[]) => any> = {
        validateSolution: validateSolution,
        executeCode: executeCode,
    };

    const oafOptions: OafOptions = {
        finString,
        funcs,
        funcDescs: functionsForModel,
        shouldRecurse: true,
    }
    const res = await callOaf(messages, clientOptions, oafOptions);

    // read from res
    const readableStream = res.body;
    if (!readableStream) {
        throw new Error(
            "ReadableStream not yet supported in this browser.",
        );
    }
    const reader = readableStream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        process.stdout.write(value);
    } 
}

main();

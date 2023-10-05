import { OafOptions, callOaf } from "oaf-agent";
import { ChatCompletionCreateParams, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { Writable } from "node:stream";
import dedent from "dedent";
import { functionsForModel, validateSolution } from "./funcs";
import { ClientOptions } from "openai";

const clientOptions: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
};

const finString = "[finished]";
const x44_solve = "3,*,*,2|1,*,3,*|*,1,*,3|4,*,*,1";
const easy_4x4_cot = dedent `
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

async function main() {
    let messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: easy_4x4_cot,
        },
        {
            role: "user",
            content: x44_solve,
        }
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
    };

    const oafOptions: OafOptions = {
        finString,
        funcs,
        funcDescs: functionsForModel,
        shouldRecurse: true,
    }
    await callOaf(messages, stream, clientOptions, oafOptions);
}

main();

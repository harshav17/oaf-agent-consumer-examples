import { OafOptions, callOaf } from "oaf-agent";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, ChatCompletionFunctions } from "openai";
import { Writable } from "node:stream";
import dedent from "dedent";
import { functionsForModel, validateSolution } from "./funcs";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const finString = "[finished]";
export const x66_solve = "2,*,*,6,*,5|*,*,6,*,1,2|*,5,1,*,*,3|3,*,4,*,*,6|*,3,5,*,*,1|*,*,2,*,3,4";
export const easy_6x6_cot_v3 = dedent `
    This is a 6x6 Sudoku puzzle.
    The * represents a cell to be filled.
    The | character separates rows.
    The , character separates cells in a row. Characters in the same position belong to the same column.
    There must be no duplicate digits in any row, column.

    Let's first understand the problem and devise a plan to solve the problem. Then, let's carry out the plan and solve the problem step by step. Display the step by step plan before proceeding.
`;

async function main() {
    let messages: ChatCompletionRequestMessage[] = [
        {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: easy_6x6_cot_v3,
        },
        {
            role: ChatCompletionRequestMessageRoleEnum.User,
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
    };

    const oafOptions: OafOptions = {
        finString,
        funcs,
        funcDescs: functionsForModel,
    }
    await callOaf(messages, stream, configuration, oafOptions);
}

main();

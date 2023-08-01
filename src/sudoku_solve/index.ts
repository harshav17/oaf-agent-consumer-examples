import { callOaf } from "oaf";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, ChatCompletionFunctions } from "openai";
import { Writable } from "node:stream";
import { finString, easy_4x4_cot, x66_solve, easy_6x6_cot, easy_6x6_cot_v2, easy_6x6_tot_prompt, easy_6x6_cot_v3 } from "./prompts";
import * as funcs from "./funcs";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    let messages: ChatCompletionRequestMessage[] = [
        {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: easy_6x6_cot_v3,
        },
        {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: x66_solve,
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

    await callOaf(messages, stream, funcs, functionsForModel, configuration, finString);
}

const functionsForModel: ChatCompletionFunctions[] = [
    {
        name: "validateSolution",
        description: "Validates whether a solution is correct. Solution should be in the pattern 3,*,*,2|1,*,3,*|*,1,*,3|4,*,*,1. You can use this method to validate intermedite solutions as well. Return empty if correcr OR description of what went wrong.",
        parameters: {
            type: "object",
            properties: {
                solution: {
                    type: "string",
                    description: "The solution to validate. For example, 3,*,*,2|1,*,3,*|*,1,*,3|4,*,*,1",
                },
            },
            required: ["solution"],
        },
    },
];

main();
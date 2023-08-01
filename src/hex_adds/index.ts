import { callOaf } from "oaf";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, ChatCompletionFunctions } from "openai";
import * as funcs from "./funcs";
import { Writable } from "node:stream";
import { finString, zero_cot } from "./prompts";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    let messages: ChatCompletionRequestMessage[] = [
        {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: zero_cot,
        },
        {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: "What is 27 + 35 + 42 + A3 + B4 + C5?",
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

    const funs: Record<string, (...args: any[]) => any> = funcs;
    await callOaf(messages, stream, funs, functionsForModel, configuration, finString);
}

const functionsForModel: ChatCompletionFunctions[] = [
    {
        name: "addDecimalValues",
        description: "Add two decimal values",
        parameters: {
            type: "object",
            properties: {
                value1: {
                    type: "number",
                    description: "The first decimal value to add. For example, 5",
                },
                value2: {
                    type: "number",
                    description: "The second decimal value to add. For example, 10",
                },
            },
            required: ["value1", "value2"],
        },
    },
    {
        name: "addHexadecimalValues",
        description: "Add two hexadecimal values",
        parameters: {
            type: "object",
            properties: {
                value1: {
                    type: "string",
                    description: "The first hexadecimal value to add. For example, 5",
                },
                value2: {
                    type: "string",
                    description: "The second hexadecimal value to add. For example, A",
                },
            },
            required: ["value1", "value2"],
        },
    },
]

main();
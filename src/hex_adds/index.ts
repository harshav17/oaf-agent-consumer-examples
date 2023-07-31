import { callOaf } from "oaf";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, ChatCompletionFunctions } from "openai";
import * as funcs from "./funcs";
import { Writable } from "node:stream";
import dedent from "dedent";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    const finString = "[finished]";
    let messages: ChatCompletionRequestMessage[] = [
        {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: dedent`
                You are addition assistant. You will use function provided to you to add given numbers.
                To add a hexadecimal value to a decimal value, you must first convert the hexadecimal value to a decimal value.
                
                You Must Always:
                1. Think step by step
                2. Use the functions provided to you to do additions.
                3. Once you think you have given the answer, you should respond to all future prompts with ${finString}.
            `,
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
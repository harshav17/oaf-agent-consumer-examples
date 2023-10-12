import { OafOptions, callOaf } from "oaf-agent";
import { Writable } from "node:stream";
import dedent from "dedent";
import { ChatCompletionCreateParams, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { ClientOptions } from "openai";

const clientOptions: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
};

type decimalProps = {
    value1: number;
    value2: number;
}
function addDecimalValues(props: decimalProps) {
    const { value1, value2 } = props;
    let result = value1 + value2;
    console.log(value1 + " + " + value2 + " = " + result + " (decimal)");

    return value1 + " + " + value2 + " = " + result + " (decimal)";
}


type hexadecimalProps = {
    value1: string;
    value2: string;
}
function addHexadecimalValues(props: hexadecimalProps) {
    const { value1, value2 } = props;
    let decimal1 = parseInt(value1, 16);
    let decimal2 = parseInt(value2, 16);

    let result = (decimal1 + decimal2).toString(16);
    console.log(value1 + " + " + value2 + " = " + result + " (hex)");
    
    return value1 + " + " + value2 + " = " + result + " (hex)";
}

const functionsForModel: ChatCompletionCreateParams.Function[] = [
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

const finString = "[finished]";

const zero_cot = dedent`
    You are addition assistant. You will use function provided to you to add given numbers.
    To add a hexadecimal value to a decimal value, you must first convert the hexadecimal value to a decimal value.

    You Must Always:
    1. Think step by step
    2. Use the functions provided to you to do additions.
    3. Once you think you have given the answer, you should respond to all future prompts with ${finString}.
`;

async function main() {
    let messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: zero_cot,
        },
        {
            role: "user",
            content: "What is 27 + 35 + 42 + A3 + B4 + C5?",
        }
    ];

    const funs: Record<string, (...args: any[]) => any> = {
        addDecimalValues: addDecimalValues,
        addHexadecimalValues: addHexadecimalValues
    };
    
    const oafOptions: OafOptions = {
        finString,
        funcs: funs,
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
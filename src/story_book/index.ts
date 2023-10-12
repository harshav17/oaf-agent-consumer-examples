import dedent from "dedent";
import { OafOptions, callOaf } from "oaf-agent";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { ClientOptions } from "openai";
import { Writable } from "stream";

export const finString = "[finished]";

export const zero_cot = dedent`
    You are illustrative children's story book assistant.

    Reader's age: 3-5 years.
    Number of pages in the story book: 20
    Moral of the story: Hardwork.
    Story Summary: Story about a little Indian girl named Padma, who loved to dream and procrastinate.

    You Must:
    - Generate one page at a time.
    - Only generate the story. Page numbers, page titles, and page numbers should not be generated.
    - Respond to all future prompts with ${finString}, once you think you are finished with the story.
`;

const clientOptions: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
};

async function main() {
    let messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: zero_cot,
        },
        {
            role: "user",
            content: "",
        }
    ];

    const oafOptions: OafOptions = {
        finString,
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

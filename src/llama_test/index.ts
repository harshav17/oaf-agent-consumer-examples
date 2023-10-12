import { OafOptions, callOaf } from "oaf-agent";
import { Writable } from "node:stream";
import dedent from "dedent";
import { ChatCompletionCreateParams, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { ClientOptions } from "openai";
import { loadDocuments, vectorIndexRetriever } from "./notion_reader";
import { MetadataMode } from "llamaindex";

const clientOptions: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
};

const functionsForModel: ChatCompletionCreateParams.Function[] = [
    {
        name: "searchDocuments",
        description: "Given a query, searches documents and returns the top 10 results",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The query to search for",
                },
            },
            required: ["query"],
        },
    }
];

let documents;

type searchDocumentsProps = {
    query: string;
}
async function searchDocuments(props: searchDocumentsProps) {
    console.log("search documents called with query: " + props.query);
    const { query } = props;

    const res = await vectorIndexRetriever(query, documents);
    
    let response = "";
    for (let i = 0; i < res.length; i++) {
        response += res[i].node.getContent(MetadataMode.LLM) + "\n";
    }
    console.log("search documents response: " + response);
    return response;
}

const finString = "[finished]";

const zero_cot = dedent`
    You are document organization assistant. 
    User will specify the topics and you should look for documents relavent to each topic, organize them into categories and return markdown.

    You Must Always:
    1. Think step by step
    2. Once you think you have given the answer, you should respond to all future prompts with ${finString}.
`;

async function main() {
    documents = await loadDocuments();

    let messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: zero_cot,
        },
        {
            role: "user",
            content: "Databases. Networking. Operating Systems. Programming Languages. Software Engineering. Theory.",
        }
    ];

    const funs: Record<string, (...args: any[]) => any> = {
        searchDocuments: searchDocuments,
    };
    
    const oafOptions: OafOptions = {
        finString,
        funcs: funs,
        funcDescs: functionsForModel,
        shouldRecurse: true,
        model: "gpt-3.5-turbo-16k-0613"
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
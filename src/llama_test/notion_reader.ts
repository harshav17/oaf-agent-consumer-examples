import { ContextChatEngine, NotionReader, SummaryIndex, VectorStoreIndex } from "llamaindex"
import { ClientOptions } from "@notionhq/client/build/src/Client";
import { Client } from "@notionhq/client";
import { VectorIndexRetriever } from "llamaindex";

export async function loadDocuments() {
    const options: ClientOptions = {
        auth: process.env.NOTION_TOKEN,
    };
    const client = new Client(options);
    const notionReader = new NotionReader({ client });
    const documents = await notionReader.loadData("e8d99970caec4edca6348259684ccc5d");
    return documents;
}

export async function vectorIndexRetriever(query: string, documents: any) {
    const index = await VectorStoreIndex.fromDocuments(documents);
    const vectorRetriever = new VectorIndexRetriever({index, similarityTopK: 10});
    const res = await vectorRetriever.retrieve(query);
    return res;
}

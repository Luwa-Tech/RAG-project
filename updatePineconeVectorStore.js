import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
//import { PineconeStore } from "langchain/vectorstores/pinecone";
import dotenv from "dotenv"
dotenv.config()


const updatePineconeVectorStore = async (client, indexName, docs) => {
    const index = client.Index(indexName);

    for (const doc of docs) {
        const txtPath = doc.metadata.source;
        const text = doc.pageContent;

        //split document into more manageable chunks
        const documentSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
        });

        const splitDocIntoChunks = await documentSplitter.splitDocuments([text]);

        console.log("create embeds")
        const embeddingsArrays = await new OpenAIEmbeddings({
            openAIApiKey: process.env.OPEN_AI_KEY
        }).embedDocuments(
            splitDocIntoChunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
        );

        console.log("finished embeds")

        console.log("batching started")
        let batch = [];
        for (let idx = 0; idx < splitDocIntoChunks.length; idx++) {
            const chunk = splitDocIntoChunks[idx];
            const vector = {
                id: `${txtPath}_${idx}`,
                values: embeddingsArrays[idx],
                metadata: {
                    ...chunk.metadata,
                    loc: JSON.stringify(chunk.metadata.loc),
                    pageContent: chunk.pageContent,
                    txtPath: txtPath,
                },
            };
            batch.push(vector);
            // When batch is full or it's the last item, upsert the vectors
            if (batch.length === batchSize || idx === splitDocIntoChunks.length - 1) {
                await index.upsert({
                    upsertRequest: {
                        vectors: batch,
                    },
                });
                // Empty the batch
                batch = [];
            }
        }
    }

    console.log("batching done")
};


export default updatePineconeVectorStore;
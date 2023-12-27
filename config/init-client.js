import { Pinecone } from "@pinecone-database/pinecone";

export const client = new Pinecone();

export const initClient = async () => {
    await client.init({
    apiKey: process.env.PINECONE_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
    });
}

import dotenv from "dotenv";

// import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { Pinecone } from "@pinecone-database/pinecone";
import createPineconeIndex from "./createPineconeIndex.js";
// // import { TextLoader } from "langchain/document_loaders/fs/text";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";

dotenv.config();
    // Set up DirectoryLoader to load documents from the ./document directory
    // const loader = new DirectoryLoader("./document", {
    //     // ".txt": (path) => new TextLoader(path),
    //     ".pdf": (path) => new PDFLoader(path),
    // });
    // const docs = await loader.load();


//initializing variables for index name and dimension
const indexName = "rag-bot-index";
const vectorDimension = 1536;


//initializing pinecone client
const client = new Pinecone({
     apiKey: process.env.PINECONE_KEY,
    environment: process.env.PINECONE_ENVIRONMENT
});


const main = async () => {
   await createPineconeIndex(client, indexName, vectorDimension);
};

main();
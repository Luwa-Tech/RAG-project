import dotenv from "dotenv";
import { initClient, client } from "./config/init-client.js";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import createIndex from "./createIndex.js"

dotenv.config();


const main = async () => {
    // Set up DirectoryLoader to load documents from the ./document directory
    const loader = new DirectoryLoader("./document", {
        // ".txt": (path) => new TextLoader(path),
        ".pdf": (path) => new PDFLoader(path),
    });
    const docs = await loader.load();


    // Set up variables for the filename and index settings
    const indexName = "rag-ebook-index";
    const vectorDimension = 1536;

    // Initialize client connection to Pinecone
    initClient();

    //create pinecone index
    await createIndex(client, vectorDimension, indexName);



}

main();
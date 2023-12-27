import { initClient, client } from "./config/init-client";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import dotenv from "dotenv";


dotenv.config();

// Set up DirectoryLoader to load documents from the ./document directory
const loader = new DirectoryLoader("./document", {
    // ".txt": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
});
const docs = await loader.load();

// Set up variables for the filename and index settings
const indexName = "";
const vectorDimension = 1536;

// Initialize client connection to Pinecone
initClient();

const main = async () => {
    
}

main();
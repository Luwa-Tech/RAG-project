import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const updatePineconeVectorStore = async (client, indexName, docs, embeddings) => {
    const index = client.Index(indexName);
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000
    });
    const queue = [];

    try {
        //const splitDocs = await splitter.splitDocuments(docs);

        // Loop over splitDocs and enqueue each splitDoc into a queue
        for (let doc of docs) {
           const docTextPath = doc.metadata.source;
           const docText = doc.pageContent;

           const textChunks = await splitter.createDocuments([docText]);

           //create textChunks embeddings
           const textChunksEmbeddingsArray = await embeddings.embedDocuments(
            textChunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
           );
           console.log(textChunksEmbeddingsArray)

           //create metadata of each splitDoc
           for (let i = 0; i < textChunks.length; i++) {
            const chunk = textChunks[i];

            const vector = {
                id: `${docTextPath}_${i}`,
                values: textChunksEmbeddingsArray[i],
                metadata: {
                    ...chunk.metadata,
                    loc: JSON.stringify(chunk.metadata.loc),
                    pageContent: chunk.pageContent,
                    docTextPath: docTextPath,
                  },
            };

            //push to queue
            queue.push(vector);
           }
        }

        console.log(queue.length)
        //upsert vectors in batches of 12 to vector database
        const batchSize = 12;
        while (queue.length > 0) {
            const batch = queue.slice(0, batchSize);

            await index.upsert(batch);
            console.log(`Processed batch of ${batch.length} documents. Remaining queue size: ${queue.length}`);
        };
    } catch (err) {
        console.error("Error occurred during document processing:", err.message);
    }
};


    // Select batch size from these; 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, and 72

const checkEmbeddingExists = async (index, docID) => {
    try {
        // Perform a similarity search to find vectors similar to the given ID
        const queryResult = await index.query({
            id: docID,
            top_k: 1,
        });
        console.log(queryResult)

        // Check if the query result contains a vector similar to the given ID
        if (queryResult.data.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking embedding:", error.message);
        return false; // Error occurred, consider embedding doesn't exist
    }
}


export default updatePineconeVectorStore;
const createPineconeIndex = async (client, indexName, vectorDimension) => {
    const existingIndexes = await client.listIndexes();
    const checkIndex = existingIndexes.find(index => index.name === indexName);


    // //check if new index is available
    if (checkIndex) {
        console.log(`index name ${indexName} already exists.`)
        return;
    } else {
        //create pinecone index
        await client.createIndex({
            name: indexName,
            dimension: vectorDimension,
            metric: "cosine"
        });

        console.log(`index ${indexName} created`);
    }
};

export default createPineconeIndex;
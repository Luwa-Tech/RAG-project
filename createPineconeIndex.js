const createPineconeIndex = async (client, indexName, vectorDimension) => {
    const existingIndexes = await client.listIndexes();
    const checkIndex = existingIndexes.find(index => index.name === indexName);

    if (checkIndex) {
        return;
    } else {
        await client.createIndex({
            name: indexName,
            dimension: vectorDimension,
            metric: "cosine"
        });

        console.log(`index ${indexName} created`);
    }
};

export default createPineconeIndex;
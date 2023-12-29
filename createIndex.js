const createIndex = async (client, vectorDimension, indexName) => {
    console.log(`Checking "${indexName}"...`);

    const existingIndexes = await client.listIndexes();

    // If index doesn't exist, create it
    if (!existingIndexes.includes(indexName)) {
        console.log(`Creating "${indexName}"...`);

        // Create index
        const createClient = await client.createIndex({
            createRequest: {
                name: indexName,
                dimension: vectorDimension,
                metric: "cosine",
            },
        });

        console.log(`Created with client:`, createClient);

        // Wait 60 seconds for index initialization
        //   await new Promise((resolve) => setTimeout(resolve, 60000));

    } else {
        console.log(`"${indexName}" already exists.`);
    }
}

export default createIndex;
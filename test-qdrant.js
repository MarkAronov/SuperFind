// Quick test to debug Qdrant issue

import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
	url: "http://localhost:6333",
});

const embeddings = new OpenAIEmbeddings({
	openAIApiKey: process.env.OPENAI_API_KEY,
	modelName: "text-embedding-3-large",
});

async function testQdrant() {
	try {
		console.log("Testing Qdrant connection...");

		// Check collections
		const collections = await client.getCollections();
		console.log(
			"Collections:",
			collections.collections.map((c) => c.name),
		);

		// Check people collection details
		const peopleCollection = await client.getCollection("people");
		console.log("People collection config:", peopleCollection.config.params);

		// Test embeddings
		const testText = "Alice Chen is a ML Engineer from New York.";
		console.log("Testing embeddings for:", testText);

		const vectors = await embeddings.embedDocuments([testText]);
		console.log("Vector dimensions:", vectors[0].length);
		console.log("First few values:", vectors[0].slice(0, 5));

		// Test upsert with minimal payload
		console.log("Testing upsert...");
		const result = await client.upsert("people", {
			wait: true,
			points: [
				{
					id: Math.floor(Math.random() * 1000000),
					vector: vectors[0],
					payload: {
						name: "Test Person",
						content: testText,
						test: true,
					},
				},
			],
		});

		console.log("Upsert result:", result);
	} catch (error) {
		console.error("Error:", error);
		if (error.response) {
			console.error("Response:", await error.response.text());
		}
	}
}

testQdrant();

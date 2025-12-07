import { QdrantClient } from "@qdrant/js-client-rest";

// Load from .env file
const url =
	"https://356b0a12-cf02-40cc-a2bc-eab396ef297f.eu-central-1-0.aws.cloud.qdrant.io:6333";
const apiKey = process.env.QDRANT_API_KEY;

console.log("Connecting to:", url);
console.log("API Key present:", !!apiKey);

const client = new QdrantClient({
	url,
	apiKey,
});

async function main() {
	try {
		// First, check the collection info to see if we have indexes
		const collectionInfo = await client.getCollection("people");
		console.log("Collection info:", JSON.stringify(collectionInfo, null, 2));

		const result = await client.scroll("people", {
			limit: 2,
			with_payload: true,
		});

		console.log("Points found:", result.points.length);
		if (result.points.length > 0) {
			console.log(
				"\nFirst point payload keys:",
				Object.keys(result.points[0].payload || {}),
			);
			console.log(
				"\nFirst point payload:",
				JSON.stringify(result.points[0].payload, null, 2),
			);

			// Test if we can find by personHash
			const testHash = (result.points[0].payload as any).personHash;
			console.log("\n\nTesting hash lookup for:", testHash);

			const searchResult = await client.scroll("people", {
				filter: {
					must: [
						{
							key: "personHash",
							match: { value: testHash },
						},
					],
				},
				limit: 1,
				with_payload: true,
			});

			console.log("Hash lookup found:", searchResult.points.length, "points");
			if (searchResult.points.length > 0) {
				console.log(
					"Found person:",
					(searchResult.points[0].payload as any).data_name,
				);
			}
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

main();

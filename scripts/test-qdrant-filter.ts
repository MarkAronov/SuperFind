import { QdrantClient } from "@qdrant/js-client-rest";

const host = process.env.QDRANT_HOST || "localhost";
const port = Number(process.env.QDRANT_PORT) || 6333;
const protocol = process.env.QDRANT_PROTOCOL || "http";
const apiKey = process.env.QDRANT_API_KEY;

const client = new QdrantClient({
	url: `${protocol}://${host}:${port}`,
	apiKey,
});

async function main() {
	try {
		// Get collection info
		console.log("=== Collection Info ===");
		const info = await client.getCollection("people");
		console.log("Points count:", info.points_count);
		console.log("Indexed vectors:", info.indexed_vectors_count);
		console.log(
			"Payload schema:",
			JSON.stringify(info.payload_schema, null, 2),
		);

		// Test scroll without filter
		console.log("\n=== Scroll without filter ===");
		const scrollResult = await client.scroll("people", {
			limit: 2,
			with_payload: true,
			with_vector: false,
		});
		console.log("Points found:", scrollResult.points.length);
		if (scrollResult.points.length > 0) {
			const payload = scrollResult.points[0].payload;
			console.log("First point payload keys:", Object.keys(payload || {}));
			console.log(
				"First point payload:",
				JSON.stringify(payload, null, 2).substring(0, 500),
			);
		}

		// Test scroll with simple filter
		console.log("\n=== Scroll with simple filter ===");
		try {
			const filteredResult = await client.scroll("people", {
				limit: 5,
				with_payload: true,
				filter: {
					must: [
						{
							key: "data_location",
							match: { value: "USA" },
						},
					],
				},
			});
			console.log("Filtered points found:", filteredResult.points.length);
		} catch (e) {
			console.log("Filter error:", e instanceof Error ? e.message : e);
		}

		// Test scroll with keyword match
		console.log("\n=== Scroll with keyword match on personHash ===");
		try {
			const hashResult = await client.scroll("people", {
				limit: 5,
				with_payload: true,
				filter: {
					must: [
						{
							key: "personHash",
							match: { value: "287bc2f1886d7bc7" },
						},
					],
				},
			});
			console.log("Hash match points found:", hashResult.points.length);
		} catch (e) {
			console.log("Hash filter error:", e instanceof Error ? e.message : e);
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

main();

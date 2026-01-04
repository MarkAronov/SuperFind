import { writeFileSync } from "node:fs";

// Manual OpenAPI spec - will be replaced with auto-generation later
const spec = {
	openapi: "3.0.3",
	info: {
		title: "SkillVector API",
		version: "1.0.0",
		description:
			"AI-powered semantic search API for finding and querying professional profiles using vector embeddings and natural language processing.",
		contact: {
			name: "SkillVector Team",
			url: "https://github.com/MarkAronov/SkillVector",
		},
		license: {
			name: "MIT",
			url: "https://opensource.org/licenses/MIT",
		},
	},
	servers: [
		{
			url: "http://localhost:3000",
			description: "Local development server",
		},
		{
			url: "https://skillvector-production.up.railway.app",
			description: "Production server",
		},
	],
	tags: [
		{
			name: "AI",
			description: "AI-powered semantic search endpoints",
		},
		{
			name: "Parser",
			description: "Data parsing and ingestion endpoints",
		},
		{
			name: "Health",
			description: "Health check and system status",
		},
	],
	paths: {
		"/": {
			get: {
				summary: "API Root",
				description: "Returns basic API information",
				tags: ["Health"],
				responses: {
					200: {
						description: "Successful response",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										message: { type: "string" },
										version: { type: "string" },
									},
								},
							},
						},
					},
				},
			},
		},
		"/health": {
			get: {
				summary: "Health Check",
				description: "Returns the health status of the API",
				tags: ["Health"],
				responses: {
					200: {
						description: "Service is healthy",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										status: { type: "string", example: "ok" },
										timestamp: { type: "string", format: "date-time" },
									},
								},
							},
						},
					},
				},
			},
		},
		"/ai/search": {
			post: {
				summary: "Semantic Search",
				description: "Search for professionals using natural language queries",
				tags: ["AI"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["query"],
								properties: {
									query: {
										type: "string",
										description: "Natural language search query",
										example: "Python developers in New York",
									},
									limit: {
										type: "number",
										description: "Maximum number of results",
										default: 10,
										minimum: 1,
										maximum: 100,
									},
									offset: {
										type: "number",
										description: "Number of results to skip",
										default: 0,
										minimum: 0,
									},
								},
							},
						},
					},
				},
				responses: {
					200: {
						description: "Successful search",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										people: {
											type: "array",
											items: {
												type: "object",
												properties: {
													id: { type: "string" },
													name: { type: "string" },
													role: { type: "string" },
													location: { type: "string" },
													skills: { type: "array", items: { type: "string" } },
													experience: { type: "string" },
													relevanceScore: { type: "number" },
												},
											},
										},
										total: { type: "number" },
										hasMore: { type: "boolean" },
									},
								},
							},
						},
					},
					400: {
						description: "Bad request",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										error: { type: "string" },
									},
								},
							},
						},
					},
				},
			},
		},
		"/parser/upload": {
			post: {
				summary: "Upload Data",
				description:
					"Upload and parse professional profile data in CSV, JSON, or TXT format",
				tags: ["Parser"],
				requestBody: {
					required: true,
					content: {
						"multipart/form-data": {
							schema: {
								type: "object",
								required: ["file"],
								properties: {
									file: {
										type: "string",
										format: "binary",
										description: "File to upload (CSV, JSON, or TXT)",
									},
								},
							},
						},
					},
				},
				responses: {
					200: {
						description: "Upload successful",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										message: { type: "string" },
										count: { type: "number" },
									},
								},
							},
						},
					},
					400: {
						description: "Invalid file format",
					},
				},
			},
		},
		"/people": {
			get: {
				summary: "List All People",
				description: "Get a paginated list of all people in the database",
				tags: ["AI"],
				parameters: [
					{
						name: "limit",
						in: "query",
						schema: { type: "number", default: 100 },
					},
					{
						name: "offset",
						in: "query",
						schema: { type: "number", default: 0 },
					},
				],
				responses: {
					200: {
						description: "List of people",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										people: { type: "array", items: { type: "object" } },
										count: { type: "number" },
									},
								},
							},
						},
					},
				},
			},
		},
	},
};

try {
	writeFileSync(
		"./frontend/public/openapi.json",
		JSON.stringify(spec, null, 2),
	);
	console.log("✓ OpenAPI spec generated at frontend/public/openapi.json");
} catch (error) {
	console.error("✗ Failed to generate OpenAPI spec:", error);
	process.exit(1);
}

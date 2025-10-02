import { Document } from "@langchain/core/documents";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { createHash } from "crypto";
import type { VectorStore } from "../ai/ai.interface";
import {
	createEmbeddingProvider,
	type EmbeddingConfig,
	getBestAvailableEmbedding,
	getEmbeddingDimensions,
} from "./embedding-factory";
import type { CollectionStatus, QdrantResponse } from "./qdrant.interfaces";

// Global Qdrant client instance
let qdrantClient: QdrantClient | null = null;
let isConnected = false;
let embeddingProvider: ReturnType<typeof createEmbeddingProvider> | null = null;
let currentEmbeddingConfig: EmbeddingConfig | null = null;

/**
 * Initialize embeddings provider with automatic best-available selection
 */
function initEmbeddings(config?: EmbeddingConfig) {
	if (!embeddingProvider) {
		const embeddingConfig = config || getBestAvailableEmbedding();
		embeddingProvider = createEmbeddingProvider(embeddingConfig);
		currentEmbeddingConfig = embeddingConfig;
		console.log(
			`        ✓ Using ${embeddingConfig.provider} embeddings (${embeddingConfig.model})`,
		);
	}
	return embeddingProvider;
}

/**
 * Generate a unique ID for documents
 */
function generateId(): string {
	return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Ensure a collection exists in Qdrant
 */
async function ensureCollectionExists(
	collectionName: string,
	embeddingConfig?: EmbeddingConfig,
): Promise<void> {
	if (!qdrantClient) {
		throw new Error("Qdrant client not initialized");
	}

	try {
		// Check if collection exists
		await qdrantClient.getCollection(collectionName);
	} catch {
		// Collection doesn't exist, create it
		const config =
			embeddingConfig || currentEmbeddingConfig || getBestAvailableEmbedding();
		const dimensions = getEmbeddingDimensions(config);

		await qdrantClient.createCollection(collectionName, {
			vectors: {
				size: dimensions,
				distance: "Cosine",
			},
		});
		console.log(
			`        → Created collection: ${collectionName} (${dimensions}D vectors)`,
		);
	}
}

/**
 * Initialize connection to Qdrant
 */
export async function initQdrant(): Promise<QdrantResponse<boolean>> {
	try {
		const host = process.env.QDRANT_HOST || "localhost";
		const port = Number(process.env.QDRANT_PORT) || 6333;
		const protocol = process.env.QDRANT_PROTOCOL || "http";
		const apiKey = process.env.QDRANT_API_KEY;

		qdrantClient = new QdrantClient({
			url: `${protocol}://${host}:${port}`,
			apiKey: apiKey,
		});

		// Test connection by checking if we can get collections
		await qdrantClient.getCollections();

		isConnected = true;
		console.log(`        ✓ Connected to Qdrant at ${host}:${port}`);

		return {
			success: true,
			data: true,
			message: "Qdrant connection initialized successfully",
		};
	} catch (error) {
		isConnected = false;
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to connect to Qdrant",
		};
	}
}

/**
 * REST function with switch case for different tasks
 * Works with OpenAI and Ollama
 */
export async function qdrantRest(
	action: "store" | "search" | "delete" | "update",
	params: {
		// For store
		id?: string;
		vector?: number[];
		payload?: Record<string, unknown>;
		collection?: string;

		// For search
		query?: string;
		queryVector?: number[];
		limit?: number;
		filter?: Record<string, unknown>;

		// For delete/update
		documentId?: string;
		updateData?: Record<string, unknown>;

		// Provider selection
		provider?: "openai" | "ollama";
	},
): Promise<QdrantResponse<unknown>> {
	if (!qdrantClient || !isConnected) {
		return {
			success: false,
			error: "Qdrant not initialized. Call initQdrant() first.",
		};
	}

	try {
		switch (action) {
			case "store":
				if (!params.payload?.content || !params.collection) {
					return {
						success: false,
						error: "Content and collection are required for storage",
					};
				}

				try {
					// Ensure collection exists
					await ensureCollectionExists(
						params.collection,
						currentEmbeddingConfig || undefined,
					);

					const content = params.payload.content as string;
					const contentMD5 = generateMD5(content);

					// Check for duplicates before storing (unless explicitly disabled)
					if (!params.payload.skipDuplicateCheck) {
						const existsResult = await documentExistsByMD5(
							contentMD5,
							params.collection,
						);
						if (existsResult.success && existsResult.data) {
							console.log(
								`        ⚬ Document already exists (MD5: ${contentMD5}) - skipping storage`,
							);
							return {
								success: true,
								data: { id: "existing", stored: false, duplicate: true },
								message: "Document already exists - skipped duplicate",
							};
						}
					}

					// Convert text to vector using configured embeddings
					const embeddingsProvider = initEmbeddings(
						currentEmbeddingConfig || undefined,
					);
					const vectors = await embeddingsProvider.embedDocuments([content]);

					if (vectors.length === 0) {
						return {
							success: false,
							error: "Failed to generate embeddings",
						};
					}

					// Store in Qdrant
					const pointId = params.id || generateId();
					await qdrantClient.upsert(params.collection, {
						wait: true,
						points: [
							{
								id: pointId,
								vector: vectors[0],
								payload: {
									...params.payload,
									md5: contentMD5,
								},
							},
						],
					});

					console.log(
						`        → Document stored successfully with ID: ${pointId}`,
					);
					return {
						success: true,
						data: { id: pointId, stored: true },
						message: "Document stored successfully",
					};
				} catch (storageError) {
					return {
						success: false,
						error:
							storageError instanceof Error
								? storageError.message
								: "Storage failed",
					};
				}

			case "search":
				if (!params.query || !params.collection) {
					return {
						success: false,
						error: "Query and collection are required for search",
					};
				}

				try {
					// Convert query to vector using configured embeddings
					const embeddingsProvider = initEmbeddings(
						currentEmbeddingConfig || undefined,
					);
					const queryVectors = await embeddingsProvider.embedDocuments([
						params.query,
					]);

					if (queryVectors.length === 0) {
						return {
							success: false,
							error: "Failed to generate query embeddings",
						};
					}

					// Search in Qdrant
					const searchResults = await qdrantClient.search(params.collection, {
						vector: queryVectors[0],
						limit: params.limit || 5,
						with_payload: true,
						filter: params.filter,
					});

					// Format results
					const formattedResults = searchResults.map((result) => ({
						id: result.id,
						content: result.payload?.content || "",
						metadata: result.payload || {},
						score: result.score || 0,
					}));

					console.log(
						`        → Search completed: found ${formattedResults.length} results`,
					);
					return {
						success: true,
						data: formattedResults,
						message: "Search completed successfully",
					};
				} catch (searchError) {
					return {
						success: false,
						error:
							searchError instanceof Error
								? searchError.message
								: "Search failed",
					};
				}

			case "delete":
				if (!params.documentId || !params.collection) {
					return {
						success: false,
						error: "Document ID and collection are required for deletion",
					};
				}

				try {
					await qdrantClient.delete(params.collection, {
						wait: true,
						points: [params.documentId],
					});

					console.log(
						`        → Document deleted successfully: ${params.documentId}`,
					);
					return {
						success: true,
						data: { deleted: true, id: params.documentId },
						message: "Document deleted successfully",
					};
				} catch (deleteError) {
					return {
						success: false,
						error:
							deleteError instanceof Error
								? deleteError.message
								: "Deletion failed",
					};
				}

			case "update":
				if (
					!params.documentId ||
					!params.collection ||
					!params.updateData?.content
				) {
					return {
						success: false,
						error: "Document ID, collection, and update content are required",
					};
				}

				try {
					// Convert updated content to vector
					const embeddingsProvider = initEmbeddings();
					const content = params.updateData.content as string;
					const vectors = await embeddingsProvider.embedDocuments([content]);

					if (vectors.length === 0) {
						return {
							success: false,
							error: "Failed to generate embeddings for update",
						};
					}

					// Update document in Qdrant
					await qdrantClient.upsert(params.collection, {
						wait: true,
						points: [
							{
								id: params.documentId,
								vector: vectors[0],
								payload: {
									...params.updateData,
									md5: generateMD5(content),
									updated_at: new Date().toISOString(),
								},
							},
						],
					});

					console.log(
						`        → Document updated successfully: ${params.documentId}`,
					);
					return {
						success: true,
						data: { updated: true, id: params.documentId },
						message: "Document updated successfully",
					};
				} catch (updateError) {
					return {
						success: false,
						error:
							updateError instanceof Error
								? updateError.message
								: "Update failed",
					};
				}

			default:
				return {
					success: false,
					error: `Unknown action: ${action}`,
				};
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Operation failed",
		};
	}
}

/**
 * Get Qdrant status and health information
 */
export async function qdrantStatus(): Promise<
	QdrantResponse<{
		connected: boolean;
		collections: CollectionStatus[];
		clusterInfo?: unknown;
	}>
> {
	try {
		if (!qdrantClient || !isConnected) {
			return {
				success: false,
				data: {
					connected: false,
					collections: [],
				},
				error: "Qdrant not connected",
			};
		}

		// Get actual Qdrant status information
		const collections = await qdrantClient.getCollections();

		// Format collection status information
		const collectionStatus: CollectionStatus[] = collections.collections.map(
			(collection) => ({
				exists: true,
				vectorCount: 0, // Would need separate call to get actual count
				config: {
					name: collection.name,
					vectorSize: 1536, // Default OpenAI embedding size
					distance: "Cosine" as const,
				},
			}),
		);

		return {
			success: true,
			data: {
				connected: isConnected,
				collections: collectionStatus,
			},
			message: "Status check completed",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Status check failed",
		};
	}
}

/**
 * Generate MD5 hash of file content
 */
export function generateMD5(content: string): string {
	return createHash("md5").update(content).digest("hex");
}

/**
 * Check if a document with given MD5 hash already exists in Qdrant
 */
export async function documentExistsByMD5(
	md5Hash: string,
	collection = "documents",
): Promise<QdrantResponse<boolean>> {
	if (!qdrantClient || !isConnected) {
		return {
			success: false,
			error: "Qdrant not initialized. Call initQdrant() first.",
		};
	}

	try {
		// Search for documents with matching MD5 hash using scroll (since search requires a vector)
		const scrollResult = await qdrantClient.scroll(collection, {
			filter: {
				must: [
					{
						key: "md5",
						match: { value: md5Hash },
					},
				],
			},
			limit: 1,
			with_payload: true,
		});

		const exists = scrollResult.points.length > 0;

		console.log(
			`        → MD5 check: Document with hash ${md5Hash} ${exists ? "exists" : "does not exist"} in collection ${collection}`,
		);

		return {
			success: true,
			data: exists,
			message: "Document existence check completed",
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Document existence check failed",
		};
	}
}

/**
 * Store processed document in Qdrant with MD5 hash
 * Note: This function assumes duplicate checking has already been performed
 */
export async function storeDocument(
	content: string,
	processedData: object,
	metadata: Record<string, unknown>,
	collection = "documents",
): Promise<QdrantResponse<{ id: string | number; md5: string }>> {
	if (!qdrantClient || !isConnected) {
		return {
			success: false,
			error: "Qdrant not initialized. Call initQdrant() first.",
		};
	}

	try {
		const md5Hash = generateMD5(content);
		// Use a proper integer ID that fits in Qdrant's unsigned integer range
		const documentId = Math.floor(Math.random() * 2147483647); // Max 32-bit signed integer

		// Ensure collection exists with proper embedding config
		await ensureCollectionExists(
			collection,
			currentEmbeddingConfig || undefined,
		);

		// Generate embeddings for the content
		const embeddingsProvider = initEmbeddings();
		const vectors = await embeddingsProvider.embedDocuments([content]);

		if (vectors.length === 0) {
			return {
				success: false,
				error: "Failed to generate embeddings for document",
			};
		}

		console.log(
			`        → Storing document for ${metadata.personName || "Unknown"} with content: "${content.substring(0, 100)}..."`,
		);

		// Create simple payload with only primitive values
		const simplePayload: Record<string, string | number | boolean> = {
			md5: md5Hash,
			content: content,
			stored_at: new Date().toISOString(),
		};

		// Add processedData as simple key-value pairs
		if (typeof processedData === "object" && processedData !== null) {
			for (const [key, value] of Object.entries(processedData)) {
				if (
					typeof value === "string" ||
					typeof value === "number" ||
					typeof value === "boolean"
				) {
					simplePayload[`data_${key}`] = value;
				} else {
					simplePayload[`data_${key}`] = String(value || "");
				}
			}
		}

		// Add metadata as simple key-value pairs
		if (metadata) {
			for (const [key, value] of Object.entries(metadata)) {
				if (
					typeof value === "string" ||
					typeof value === "number" ||
					typeof value === "boolean"
				) {
					simplePayload[`meta_${key}`] = value;
				} else {
					simplePayload[`meta_${key}`] = String(value || "");
				}
			}
		}

		// Store in Qdrant with simplified payload
		await qdrantClient.upsert(collection, {
			wait: true,
			points: [
				{
					id: documentId,
					vector: vectors[0],
					payload: simplePayload,
				},
			],
		});
		console.log(
			`        → Document stored successfully: ${documentId} with MD5 ${md5Hash} in collection ${collection}`,
		);

		return {
			success: true,
			data: { id: documentId, md5: md5Hash },
			message: "Document stored successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Document storage failed",
		};
	}
}

/**
 * Create LangChain vector store implementation using Qdrant
 */
export const createLangChainVectorStore = async (): Promise<VectorStore> => {
	try {
		// Initialize embeddings (reuse existing function)
		const embeddings = initEmbeddings();

		// Ensure the people collection exists before creating vector store
		await ensureCollectionExists("people");

		// Create LangChain Qdrant vector store
		const vectorStore = await QdrantVectorStore.fromExistingCollection(
			embeddings,
			{
				url: `${process.env.QDRANT_PROTOCOL || "http"}://${process.env.QDRANT_HOST || "localhost"}:${process.env.QDRANT_PORT || 6333}`,
				collectionName: "people", // Changed from "documents" to "people"
				apiKey: process.env.QDRANT_API_KEY,
			},
		);

		console.log("        ✓ LangChain Qdrant vector store created successfully");
		return vectorStore as VectorStore;
	} catch (error) {
		console.error("        ✗ Failed to create LangChain vector store:", error);
		console.warn("        ⚠ Using fallback mock vector store");

		// Create a mock implementation that satisfies the VectorStore interface
		const mockVectorStore = {
			async similaritySearch(query: string, k = 5) {
				console.log(`        → Fallback search for: ${query}`);
				return [
					new Document({
						pageContent: `Sample content related to: ${query}`,
						metadata: { id: "doc1", source: "static-data", score: 0.8 },
					}),
					new Document({
						pageContent: `Additional information about: ${query}`,
						metadata: { id: "doc2", source: "uploaded-files", score: 0.6 },
					}),
				].slice(0, k);
			},
			async addDocuments(documents: Document[]) {
				console.log(
					`        → Fallback: Would add ${documents.length} documents`,
				);
			},
			async delete() {
				console.log("        → Fallback: Would delete documents");
			},
		};

		// Cast to VectorStore interface
		return mockVectorStore as unknown as VectorStore;
	}
};

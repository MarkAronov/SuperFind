import { Document } from "@langchain/core/documents";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import type { VectorStore } from "../ai/types";
import { log } from "../utils/logger";
// Note: Using generic types here to match the original implementation
import {
	createEmbeddingProvider,
	type EmbeddingConfig,
	getBestAvailableEmbedding,
	getEmbeddingDimensions,
} from "./embedding-factory";
import type { CollectionStatus, QdrantResponse } from "./types";

// Global Qdrant client instance
let qdrantClient: QdrantClient | null = null;
let isConnected = false;
let embeddingProvider: ReturnType<typeof createEmbeddingProvider> | null = null;
let currentEmbeddingConfig: EmbeddingConfig | null = null;

/**
 * Initialize embeddings provider with automatic best-available selection
 */
const initEmbeddings = (config?: EmbeddingConfig) => {
	if (!embeddingProvider) {
		const embeddingConfig = config || getBestAvailableEmbedding();
		embeddingProvider = createEmbeddingProvider(embeddingConfig);
		currentEmbeddingConfig = embeddingConfig;
		log(
			"DB_EMBEDDING_PROVIDER",
			{
				provider: embeddingConfig.provider,
				model: embeddingConfig.model,
			},
			2,
		);
	}
	return embeddingProvider;
};

/**
 * Generate a unique ID for documents
 */
const generateId = (): string => {
	return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Ensure a collection exists in Qdrant with proper payload indexes
 */
const ensureCollectionExists = async (
	collectionName: string,
	embeddingConfig?: EmbeddingConfig,
): Promise<void> => {
	if (!qdrantClient) {
		throw new Error("Qdrant client not initialized");
	}

	try {
		// Check if collection exists
		const collectionInfo = await qdrantClient.getCollection(collectionName);

		// Define all required indexes for hybrid search and filtering
		const requiredIndexes = [
			{ field: "personHash", schema: "keyword" },
			{ field: "data_location", schema: { type: "text", tokenizer: "word" } },
			{ field: "data_role", schema: { type: "text", tokenizer: "word" } },
			{ field: "data_skills", schema: { type: "text", tokenizer: "word" } },
			{ field: "data_experience_years", schema: "integer" },
			{ field: "content", schema: { type: "text", tokenizer: "word" } },
		];

		// Create missing indexes
		for (const { field, schema } of requiredIndexes) {
			const hasIndex = collectionInfo.payload_schema?.[field] !== undefined;
			if (!hasIndex) {
				await qdrantClient.createPayloadIndex(collectionName, {
					field_name: field,
					// biome-ignore lint/suspicious/noExplicitAny: Qdrant schema type is union of multiple types
					field_schema: schema as any,
				});
				log(
					"DB_INDEX_CREATED",
					{
						collection: collectionName,
						field,
					},
					2,
				);
			}
		}
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
		log(
			"DB_COLLECTION_CREATED",
			{
				collection: collectionName,
				dimensions: dimensions.toString(),
			},
			2,
		);

		// Create all required indexes
		const requiredIndexes = [
			{ field: "personHash", schema: "keyword" },
			{ field: "data_location", schema: { type: "text", tokenizer: "word" } },
			{ field: "data_role", schema: { type: "text", tokenizer: "word" } },
			{ field: "data_skills", schema: { type: "text", tokenizer: "word" } },
			{ field: "data_experience_years", schema: "integer" },
			{ field: "content", schema: { type: "text", tokenizer: "word" } },
		];

		for (const { field, schema } of requiredIndexes) {
			await qdrantClient.createPayloadIndex(collectionName, {
				field_name: field,
				// biome-ignore lint/suspicious/noExplicitAny: Qdrant schema type is union of multiple types
				field_schema: schema as any,
			});
			log(
				"DB_INDEX_CREATED",
				{
					collection: collectionName,
					field,
				},
				2,
			);
		}
	}
};

/**
 * Initialize connection to Qdrant
 */
export const initQdrant = async (): Promise<QdrantResponse<boolean>> => {
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
		log("DB_CONNECTED", { host, port: port.toString() }, 2);

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
};

/**
 * REST function with switch case for different tasks
 * Works with OpenAI and Ollama
 */
export const qdrantRest = async (
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
): Promise<QdrantResponse<unknown>> => {
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
					const personHash = params.payload.personHash as string;

					// Check for duplicates before storing (unless explicitly disabled)
					if (!params.payload.skipDuplicateCheck && personHash) {
						const existsResult = await documentExistsByHash(
							personHash,
							params.collection,
						);
						if (existsResult.success && existsResult.data) {
							log("DB_DOCUMENT_EXISTS", { hash: personHash }, 2);
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
									personHash: personHash || "",
								},
							},
						],
					});

					log("DB_DOCUMENT_STORED", { id: pointId }, 2);
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

					log(
						"DB_SEARCH_COMPLETE",
						{ count: formattedResults.length.toString() },
						2,
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

					log("DB_DOCUMENT_DELETED", { id: params.documentId }, 2);
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
									updated_at: new Date().toISOString(),
								},
							},
						],
					});

					log("DB_DOCUMENT_UPDATED", { id: params.documentId }, 2);
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
};

/**
 * Get Qdrant status and health information
 */
export const qdrantStatus = async (): Promise<
	QdrantResponse<{
		connected: boolean;
		collections: CollectionStatus[];
		clusterInfo?: unknown;
	}>
> => {
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
};

/**
 * Retrieve all documents from a collection (no vector search required)
 */
export const getAllDocuments = async (
	collection = "people",
	limit = 100,
): Promise<QdrantResponse<unknown[]>> => {
	if (!qdrantClient || !isConnected) {
		return {
			success: false,
			error: "Qdrant not initialized. Call initQdrant() first.",
		};
	}

	try {
		// Use scroll to retrieve all documents without vector search
		const scrollResult = await qdrantClient.scroll(collection, {
			limit,
			with_payload: true,
			with_vector: false, // Don't need vectors, just the data
		});

		// Format results similar to search results
		const formattedResults = scrollResult.points.map((point) => ({
			id: point.id,
			content: point.payload?.content || "",
			metadata: point.payload || {},
		}));

		log(
			"DB_ALL_DOCUMENTS_RETRIEVED",
			{
				count: formattedResults.length.toString(),
				collection,
			},
			2,
		);

		return {
			success: true,
			data: formattedResults,
			message: `Retrieved ${formattedResults.length} documents from ${collection}`,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to retrieve documents",
		};
	}
};

/**
 * Check if a document with given personHash already exists in Qdrant
 */
export const documentExistsByHash = async (
	hash: string,
	collection = "documents",
): Promise<QdrantResponse<boolean>> => {
	if (!qdrantClient || !isConnected) {
		return {
			success: false,
			error: "Qdrant not initialized. Call initQdrant() first.",
		};
	}

	try {
		// Search for documents with matching personHash using scroll
		const scrollResult = await qdrantClient.scroll(collection, {
			filter: {
				must: [
					{
						key: "personHash",
						match: { value: hash },
					},
				],
			},
			limit: 1,
			with_payload: true,
		});

		const exists = scrollResult.points.length > 0;

		log(
			"DB_HASH_CHECK",
			{
				hash,
				exists: exists.toString(),
				collection,
			},
			2,
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
};

/**
 * Store processed document in Qdrant with person hash
 * Now uses typed Person data for better consistency
 * Note: This function assumes duplicate checking has already been performed
 */
export const storeDocument = async (
	content: string,
	processedData: object,
	metadata: Record<string, unknown>,
	collection = "documents",
): Promise<QdrantResponse<{ id: string | number; hash: string }>> => {
	if (!qdrantClient || !isConnected) {
		return {
			success: false,
			error: "Qdrant not initialized. Call initQdrant() first.",
		};
	}

	try {
		// Use personHash from metadata (required for person deduplication)
		const personHash = metadata.personHash as string;
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

		log(
			"DB_STORING_DOCUMENT",
			{
				name: (metadata.personName as string) || "Unknown",
				preview: content.substring(0, 100),
			},
			2,
		);

		// Create simple payload with only primitive values
		const simplePayload: Record<string, string | number | boolean> = {
			personHash: personHash || "", // Person identity hash for deduplication
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
		log(
			"DB_DOCUMENT_STORE_SUCCESS",
			{
				id: documentId.toString(),
				hash: personHash,
				collection,
			},
			2,
		);

		return {
			success: true,
			data: { id: documentId, hash: personHash },
			message: "Document stored successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Document storage failed",
		};
	}
};

/**
 * Hybrid search combining vector similarity with keyword/BM25 search and metadata filtering
 * Uses Qdrant's query API with RRF (Reciprocal Rank Fusion) for optimal results
 */
export const hybridSearch = async (
	query: string,
	filters?: {
		location?: string;
		skills?: string;
		role?: string;
		minExperience?: number;
		maxExperience?: number;
	},
	limit = 10,
	collection = "people",
): Promise<
	QdrantResponse<
		Array<{
			id: string | number;
			score: number;
			content: string;
			metadata: Record<string, unknown>;
		}>
	>
> => {
	if (!qdrantClient || !isConnected) {
		return {
			success: false,
			error: "Qdrant not initialized. Call initQdrant() first.",
		};
	}

	try {
		console.log("[hybridSearch] Starting search with query:", query);
		console.log("[hybridSearch] Filters:", JSON.stringify(filters, null, 2));
		console.log("[hybridSearch] Limit:", limit, "Collection:", collection);

		// Ensure collection exists with proper indexes
		await ensureCollectionExists(collection);
		console.log("[hybridSearch] Collection exists confirmed");

		// Generate embedding for vector search
		const embeddingsProvider = initEmbeddings();
		const vectors = await embeddingsProvider.embedDocuments([query]);
		console.log(
			"[hybridSearch] Generated embeddings, vector length:",
			vectors.length,
		);

		if (vectors.length === 0) {
			return {
				success: false,
				error: "Failed to generate embeddings for query",
			};
		}

		// Build metadata filter conditions
		// NOTE: data_location and data_role are indexed as 'keyword' (exact match only)
		// data_skills and content are indexed as 'text' (supports text search)
		// For keyword fields, we skip filters that won't match exactly
		// For text fields, we use 'text' match for partial matching
		const filterConditions: Array<Record<string, unknown>> = [];

		// Skip location and role filters since they're keyword indexes
		// and the AI extracts generic terms like "North America" or "Developer"
		// that won't match exact values like "San Diego, USA" or "Software Architect"
		// The vector search will handle semantic matching for these

		if (filters?.location) {
			console.log(
				"[hybridSearch] Skipping location filter (keyword index, exact match only):",
				filters.location,
			);
		}

		if (filters?.role) {
			console.log(
				"[hybridSearch] Skipping role filter (keyword index, exact match only):",
				filters.role,
			);
		}

		if (filters?.skills) {
			// Text match for skills - data_skills is indexed as 'text' with word tokenizer
			const skillsText = Array.isArray(filters.skills)
				? filters.skills.join(" ")
				: filters.skills;
			const skillsFilter = {
				key: "data_skills",
				match: { text: skillsText },
			};
			filterConditions.push(skillsFilter);
			console.log(
				"[hybridSearch] Added skills filter:",
				JSON.stringify(skillsFilter),
			);
		}

		if (
			filters?.minExperience !== undefined ||
			filters?.maxExperience !== undefined
		) {
			// Try to filter on data_experience_years first (number field)
			const rangeFilter: Record<string, unknown> = {
				key: "data_experience_years",
				range: {},
			};
			if (filters.minExperience !== undefined) {
				(rangeFilter.range as Record<string, number>).gte =
					filters.minExperience;
			}
			if (filters.maxExperience !== undefined) {
				(rangeFilter.range as Record<string, number>).lte =
					filters.maxExperience;
			}
			filterConditions.push(rangeFilter);
			console.log(
				"[hybridSearch] Added experience filter:",
				JSON.stringify(rangeFilter),
			);
		}

		console.log(
			"[hybridSearch] Total filter conditions:",
			filterConditions.length,
		);
		console.log(
			"[hybridSearch] Filter conditions:",
			JSON.stringify(filterConditions, null, 2),
		);

		// Execute vector search with metadata filtering
		const searchParams = {
			vector: vectors[0],
			limit,
			with_payload: true,
			filter:
				filterConditions.length > 0 ? { must: filterConditions } : undefined,
		};
		console.log(
			"[hybridSearch] Executing Qdrant search with params:",
			JSON.stringify(
				{
					...searchParams,
					vector: `[${vectors[0].length} dimensions]`,
				},
				null,
				2,
			),
		);

		const result = await qdrantClient.search(collection, searchParams);
		console.log(
			"[hybridSearch] Search completed, results count:",
			result.length,
		);

		// Apply metadata-based relevance boost when query matches structured fields
		// (role/title and skills). This is applied BEFORE the relevance threshold filter.
		const queryLower = query.toLowerCase();
		const queryTokens = queryLower.split(/\W+/).filter(Boolean);

		const TITLE_BOOST_STRONG = 0.35; // Exact token match in role
		const TITLE_BOOST_WEAK = 0.15; // Partial substring match in role
		const SKILLS_BOOST = 0.1; // Query token found in skills

		const boostedResults = result.map((point) => {
			let score = point.score || 0;
			const boostReasons: string[] = [];

			// Check both title and skills together as metadata matching
			const role = (point.payload?.data_role as string | undefined) || "";
			const skills = (point.payload?.data_skills as string | undefined) || "";

			// Title/role matching
			if (role) {
				const roleLower = role.toLowerCase();
				const roleTokens = roleLower.split(/\W+/).filter(Boolean);

				const strongMatch = queryTokens.some((qt) => roleTokens.includes(qt));
				const weakMatch =
					!strongMatch && queryTokens.some((qt) => roleLower.includes(qt));

				if (strongMatch) {
					score = Math.min(1, score + TITLE_BOOST_STRONG);
					boostReasons.push("title-strong");
				} else if (weakMatch) {
					score = Math.min(1, score + TITLE_BOOST_WEAK);
					boostReasons.push("title-weak");
				}
			}

			// Skills matching
			if (skills) {
				const skillsLower = skills.toLowerCase();
				const skillsTokens = skillsLower.split(/\W+/).filter(Boolean);

				const skillsMatch = queryTokens.some(
					(qt) => skillsTokens.includes(qt) || skillsLower.includes(qt),
				);

				if (skillsMatch) {
					score = Math.min(1, score + SKILLS_BOOST);
					boostReasons.push("skills");
				}
			}

			if (boostReasons.length > 0) {
				(point.payload as any)._boostedBy = boostReasons.join("+");
			}

			return { ...point, score };
		});

		const boostedCount = boostedResults.filter(
			(p) => (p.payload as any)?._boostedBy,
		).length;
		console.log("[hybridSearch] Metadata-boosted results count:", boostedCount);

		// Filter out low-quality results (relevance threshold)
		// This prevents nonsense queries from returning random results
		const RELEVANCE_THRESHOLD = 0.3; // Adjust this threshold as needed
		const filteredResults = boostedResults.filter(
			(point) => (point.score || 0) >= RELEVANCE_THRESHOLD,
		);

		console.log(
			`[hybridSearch] Results after relevance filter (>=${RELEVANCE_THRESHOLD}):`,
			filteredResults.length,
		);

		// Format results
		const formattedResults = filteredResults.map((point) => ({
			id: point.id,
			score: point.score || 0,
			content: (point.payload?.content as string) || "",
			metadata: point.payload || {},
		}));

		console.log(
			"[hybridSearch] Formatted results count:",
			formattedResults.length,
		);

		log(
			"DB_HYBRID_SEARCH",
			{
				query,
				filters: JSON.stringify(filters || {}),
				resultsCount: formattedResults.length.toString(),
			},
			2,
		);

		return {
			success: true,
			data: formattedResults,
			message: `Found ${formattedResults.length} results`,
		};
	} catch (error) {
		console.error("[hybridSearch] ERROR:", error);
		console.error("[hybridSearch] Error details:", {
			message: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});
		log("DB_HYBRID_SEARCH_ERROR", { error: String(error) }, 2);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Hybrid search failed",
		};
	}
};

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

		log("DB_VECTORSTORE_CREATED", {}, 2);
		return vectorStore as VectorStore;
	} catch (error) {
		log("DB_VECTORSTORE_FAILED", { error: String(error) }, 2);
		log("DB_USING_FALLBACK", {}, 2);

		// Create a mock implementation that satisfies the VectorStore interface
		const mockVectorStore = {
			async similaritySearch(query: string, k = 5) {
				log("DB_FALLBACK_SEARCH", { query }, 2);
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
				log("DB_FALLBACK_ADD", { count: documents.length.toString() }, 2);
			},
			async delete() {
				log("DB_FALLBACK_DELETE", {}, 2);
			},
		};

		// Cast to VectorStore interface
		return mockVectorStore as unknown as VectorStore;
	}
};

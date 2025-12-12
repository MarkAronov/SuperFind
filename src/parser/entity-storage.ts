import { documentExistsByHash, storeDocument } from "../database";
import type { Person, PersonMetadata } from "../types/person";
import { generatePersonHash } from "../types/person";
import { log } from "../utils/logger";
import {
	createPersonContent,
	enhancePersonData,
	validatePersonData,
} from "./person-extractor";
import type { EntityResult, ProcessedFile, RunContext } from "./types";

/**
 * Entity storage service - handles extraction and storage of entities
 * to the vector database (Qdrant)
 */

// In-memory storage for processed data (could be replaced with database)
let processedDataStore: ProcessedFile[] = [];

/**
 * Extract individual entities from processed data and store each as separate vector
 */
export const extractAndStoreEntities = async (
	originalContent: string,
	processedData: object,
	baseMetadata: Record<string, unknown>,
	context: RunContext,
): Promise<EntityResult[]> => {
	const entities: EntityResult[] = [];

	// Handle CSV files with multiple people
	if (Array.isArray(processedData)) {
		for (const item of processedData) {
			if (item && typeof item === "object") {
				// Use description as context for enhancement, or empty string if not available
				// Do NOT use originalContent (full file) as it causes cross-contamination
				const itemRecord = item as Record<string, unknown>;
				const itemContext =
					typeof itemRecord.description === "string"
						? itemRecord.description
						: "";

				// Enhance person data with better extraction
				const enhancedItem = enhancePersonData(item as Person, itemContext);

				// Validate person has required fields
				const validation = validatePersonData(enhancedItem);
				if (!validation.isValid) {
					context.bads += 1;
					log(
						"PARSER_PERSON_SKIPPED",
						{
							name: enhancedItem.name || "Unknown",
							fields: validation.missingFields.join(", "),
						},
						2,
					);
					continue; // Skip invalid entries
				}

				const personContent = createPersonContent(enhancedItem);
				const entityId = `person_${enhancedItem.name?.toString().replace(/\s+/g, "_")?.toLowerCase() || Date.now()}`;

				const entityMetadata: PersonMetadata = {
					...baseMetadata,
					entityType: "person" as const,
					entityId,
					personName: enhancedItem.name || "Unknown",
					role: enhancedItem.role,
					location: enhancedItem.location,
					skills: enhancedItem.skills,
					experience: enhancedItem.experience,
					email: enhancedItem.email,
				};

				// Check if this specific person already exists using person identity hash
				const personHash = generatePersonHash(enhancedItem);
				const existsResult = await documentExistsByHash(personHash, "people");

				if (existsResult.success && existsResult.data) {
					context.dupes += 1;
					log(
						"PARSER_DUPLICATE_SKIPPED",
						{
							name: enhancedItem.name || "Unknown",
							hash: personHash,
						},
						2,
					);
					continue; // Skip duplicates entirely
				}

				// Store each person as separate vector (pass the hash for storage)
				const storeResult = await storeDocument(
					personContent,
					enhancedItem,
					{ ...entityMetadata, personHash },
					"people", // Use separate collection for people
				);

				entities.push({
					id: entityId,
					content: personContent,
					entityType: "person",
					storedInQdrant: storeResult.success,
					metadata: entityMetadata,
				});

				if (storeResult.success) {
					log("PARSER_PERSON_STORED", { name: item.name || "Unknown" }, 2);
				} else {
					log(
						"PARSER_PERSON_FAILED",
						{
							name: item.name || "Unknown",
							error: storeResult.error || "Unknown error",
						},
						2,
					);
				}
			}
		}
	}
	// Handle single entity objects (like text files)
	else if (processedData && typeof processedData === "object") {
		const personData = processedData as Record<string, unknown>;

		// Enhance person data with better extraction from original content
		const enhancedData = enhancePersonData(
			personData as Person,
			originalContent,
		);

		// Validate person has required fields
		const validation = validatePersonData(enhancedData);
		if (!validation.isValid) {
			context.bads += 1;
			log(
				"PARSER_PERSON_SKIPPED",
				{
					name: enhancedData.name || "Unknown",
					fields: validation.missingFields.join(", "),
				},
				2,
			);
			return entities; // Return empty entities list
		}

		const personContent = originalContent; // Use original content for text files
		const entityId = `person_${enhancedData.name?.toString()?.replace(/\s+/g, "_")?.toLowerCase() || Date.now()}`;

		const entityMetadata: PersonMetadata = {
			...baseMetadata,
			entityType: "person" as const,
			entityId,
			personName: enhancedData.name || "Unknown",
			role: enhancedData.role,
			location: enhancedData.location,
			skills: enhancedData.skills,
			experience: enhancedData.experience,
			email: enhancedData.email,
		};

		// Check if this specific person already exists using person identity hash
		const personHash = generatePersonHash(enhancedData);
		const existsResult = await documentExistsByHash(personHash, "people");

		let storeResult: { success: boolean; error?: string };
		if (existsResult.success && existsResult.data) {
			context.dupes += 1;
			log(
				"PARSER_DUPLICATE_SKIPPED",
				{
					name: enhancedData.name || "Unknown",
					hash: personHash,
				},
				2,
			);
			return entities;
		} else {
			storeResult = await storeDocument(
				personContent,
				enhancedData,
				{ ...entityMetadata, personHash },
				"people",
			);
		}

		entities.push({
			id: entityId,
			content: personContent,
			entityType: "person",
			storedInQdrant: storeResult.success,
			metadata: entityMetadata,
		});

		if (storeResult.success) {
			log("PARSER_PERSON_STORED", { name: personData.name || "Unknown" }, 2);
		} else {
			log(
				"PARSER_PERSON_STORE_FAILED",
				{
					name: personData.name || "Unknown",
					error: storeResult.error || "Unknown error",
				},
				2,
			);
		}
	}

	return entities;
};

/**
 * Store processed file data
 */
export const storeProcessedData = (data: ProcessedFile[]): void => {
	processedDataStore = [...data];
	log("PARSER_DATA_STORED", { count: data.length.toString() }, 1);
};

/**
 * Get statistics about the data store
 */
export const getDataStoreStats = (): {
	totalFiles: number;
	filesByType: Record<string, number>;
	totalSizeEstimate: number;
} => {
	const filesByType: Record<string, number> = {};
	let totalSizeEstimate = 0;

	for (const data of processedDataStore) {
		filesByType[data.dataType] = (filesByType[data.dataType] || 0) + 1;
		// Rough estimate based on processed data
		if (data.processedData) {
			totalSizeEstimate += JSON.stringify(data.processedData).length;
		}
	}

	return {
		totalFiles: processedDataStore.length,
		filesByType,
		totalSizeEstimate,
	};
};

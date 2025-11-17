import { documentExistsByMD5, generateMD5, storeDocument } from "../database";
import type { Person, PersonMetadata } from "../types/person";
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
				// Enhance person data with better extraction
				const enhancedItem = enhancePersonData(item as Person, originalContent);

				// Validate person has required fields
				const validation = validatePersonData(enhancedItem);
				if (!validation.isValid) {
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

				// Check if this specific person already exists using content hash
				const personMD5 = generateMD5(personContent);
				const existsResult = await documentExistsByMD5(personMD5, "people");

				if (existsResult.success && existsResult.data) {
					// Count and optionally cap duplicates
					context.dupes += 1;
					if (context.dupes > context.maxDupes) {
						// Skip adding more duplicate entries beyond the cap
						log(
							"PARSER_DUPLICATE_CAPPED",
							{
								name: enhancedItem.name || "Unknown",
								max: context.maxDupes.toString(),
							},
							2,
						);
						continue;
					}
					log(
						"PARSER_PERSON_EXISTS",
						{
							name: enhancedItem.name || "Unknown",
							md5: personMD5,
						},
						2,
					);
					entities.push({
						id: entityId,
						content: personContent,
						entityType: "person",
						storedInQdrant: true, // Already exists
						metadata: entityMetadata,
					});
					continue; // Skip to next person
				}

				// Store each person as separate vector
				const storeResult = await storeDocument(
					personContent,
					enhancedItem,
					entityMetadata,
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
						"PARSER_PERSON_STORE_FAILED",
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
			if (context.bads <= context.maxBads) {
				log(
					"PARSER_PERSON_SKIPPED",
					{
						name: enhancedData.name || "Unknown",
						fields: validation.missingFields.join(", "),
					},
					2,
				);
			} else {
				log(
					"PARSER_INVALID_CAPPED",
					{
						name: enhancedData.name || "Unknown",
						max: context.maxBads.toString(),
					},
					2,
				);
			}
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

		// Check if this specific person already exists using content hash
		const personMD5 = generateMD5(personContent);
		const existsResult = await documentExistsByMD5(personMD5, "people");

		let storeResult: { success: boolean; error?: string };
		if (existsResult.success && existsResult.data) {
			log(
				"PARSER_PERSON_EXISTS",
				{
					name: enhancedData.name || "Unknown",
					md5: personMD5,
				},
				2,
			);
			storeResult = { success: true }; // Mark as successful since it already exists
		} else {
			storeResult = await storeDocument(
				personContent,
				enhancedData,
				entityMetadata,
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

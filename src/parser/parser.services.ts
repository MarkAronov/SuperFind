import { promises as fs } from "node:fs";
import * as path from "node:path";
import * as Papa from "papaparse";
import { convertTextToJson } from "../ai/ai.services";
import {
	documentExistsByMD5,
	generateMD5,
	storeDocument,
} from "../database/qdrant.services";
import type { Person, PersonMetadata } from "../types/person.types";
import { normalizePerson, validatePerson } from "../types/person.types";
import { extractKeysFromInterface } from "../utils/interface-parser";
import type {
	CsvRow,
	EntityResult,
	FileInfo,
	ProcessedFile,
	RunContext,
} from "./parser.types";

/**
 * Comprehensive file parser service - handles CSV, JSON, and Text parsing
 * for both uploaded files and static files
 */

// In-memory storage for processed data (could be replaced with database)
let processedDataStore: ProcessedFile[] = [];

/**
 * Extract individual entities from processed data and store each as separate vector
 */
async function extractAndStoreEntities(
	originalContent: string,
	processedData: object,
	baseMetadata: Record<string, unknown>,
	context: RunContext,
): Promise<EntityResult[]> {
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
					console.log(
						`        ⚠ Skipping ${enhancedItem.name || "Unknown"}: missing required fields: ${validation.missingFields.join(", ")}`,
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
						console.log(
							`        ⚬ Skipping duplicate beyond cap (>${context.maxDupes}): ${enhancedItem.name || "Unknown"}`,
						);
						continue;
					}
					console.log(
						`        ⚬ Person ${enhancedItem.name || "Unknown"} already exists (MD5: ${personMD5})`,
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
					console.log(`        → Stored person: ${item.name || "Unknown"}`);
				} else {
					console.error(
						`        ✗ Failed to store person: ${item.name || "Unknown"} - ${storeResult.error}`,
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
				console.log(
					`        ⚠ Skipping ${enhancedData.name || "Unknown"}: missing required fields: ${validation.missingFields.join(", ")}`,
				);
			} else {
				console.log(
					`        ⚠ Skipping invalid entry beyond bad cap (>${context.maxBads}): ${enhancedData.name || "Unknown"}`,
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
			console.log(
				`        ⚬ Person ${enhancedData.name || "Unknown"} already exists (MD5: ${personMD5})`,
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
			console.log(`        → Stored person: ${personData.name || "Unknown"}`);
		} else {
			console.error(
				`        ✗ Failed to store person: ${personData.name || "Unknown"} - ${storeResult.error}`,
			);
		}
	}

	return entities;
}

/**
 * Create human-readable content for a person entity
 */
function getString(
	obj: Record<string, unknown>,
	key: string,
	fallback: string,
): string {
	const v = obj[key];
	return typeof v === "string" && v.trim().length > 0 ? v : fallback;
}

function createPersonContent(person: Record<string, unknown>): string {
	const name = getString(person, "name", "Unknown");
	const role = getString(person, "role", "Unknown role");
	const location = getString(person, "location", "Unknown location");
	const skillsVal = person.skills;
	const skills = Array.isArray(skillsVal)
		? skillsVal.join(", ")
		: typeof skillsVal === "string" && skillsVal.trim().length > 0
			? skillsVal
			: "No skills listed";
	const expVal = person.experience ?? person.experience_years;
	const experience =
		typeof expVal === "number" || typeof expVal === "string"
			? expVal
			: "Unknown experience";
	const email = getString(person, "email", "");

	let content = `${name} is a ${role} from ${location}. Skills: ${skills}. Experience: ${experience} years.`;
	if (email) {
		content += ` Email: ${email}`;
	}
	return content;
}

/**
 * Validate person data has required fields using shared type validation
 */
function validatePersonData(person: Record<string, unknown>): {
	isValid: boolean;
	missingFields: string[];
} {
	// Use the shared validation function
	const result = validatePerson(person);
	return {
		isValid: result.isValid,
		missingFields: result.missingFields,
	};
}

/**
 * Extract location from various text patterns
 */
function extractLocationFromText(text: string): string | null {
	// Pattern 1: "from City, Country"
	let match = text.match(/from\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/i);
	if (match) return match[1].trim();

	// Pattern 2: "in City, Country"
	match = text.match(/\bin\s+([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/i);
	if (match) return match[1].trim();

	// Pattern 3: "career in City, Country" or "career in Country"
	match = text.match(
		/career\s+in\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/i,
	);
	if (match) return match[1].trim();

	// Pattern 4: "Location: City, Country"
	match = text.match(/location:\s*([A-Z][a-zA-Z\s,]+?)(?:\.|;|\n|$)/i);
	if (match) return match[1].trim();

	// Pattern 5: "based in City/Country"
	match = text.match(/based\s+in\s+([A-Z][a-zA-Z\s,]+?)(?:\.|;|\n|$)/i);
	if (match) return match[1].trim();

	// Pattern 6: "lives in City/Country"
	match = text.match(/lives?\s+in\s+([A-Z][a-zA-Z\s,]+?)(?:\.|;|\n|$)/i);
	if (match) return match[1].trim();

	// Pattern 7: "works in City/Country"
	match = text.match(/works?\s+in\s+([A-Z][a-zA-Z\s,]+?)(?:\.|;|\n|$)/i);
	if (match) return match[1].trim();

	return null;
}

/**
 * Extract skills from text patterns
 */
function extractSkillsFromText(text: string): string | null {
	// Pattern 1: "Skills: ..."
	let match = text.match(/skills?:\s*([^.\n]+)/i);
	if (match) return match[1].trim();

	// Pattern 2: "specializes in ..."
	match = text.match(
		/specializes?\s+in\s+([^.\n]+?)(?:\s+with|\s+and has|\.|$)/i,
	);
	if (match) return match[1].trim();

	// Pattern 3: "expertise in ..."
	match = text.match(/expertise\s+in\s+([^.\n]+?)(?:\s+and|\.|$)/i);
	if (match) return match[1].trim();

	return null;
}

/**
 * Extract experience years from text
 */
function extractExperienceFromText(text: string): number | null {
	// Pattern 1: "X years of experience"
	let match = text.match(
		/(\d+)\s+years?\s+of\s+(?:professional\s+)?experience/i,
	);
	if (match) return Number.parseInt(match[1]);

	// Pattern 2: "Experience: X years"
	match = text.match(/experience:\s*(\d+)\s*years?/i);
	if (match) return Number.parseInt(match[1]);

	// Pattern 3: "with X years"
	match = text.match(/with\s+(\d+)\s+years/i);
	if (match) return Number.parseInt(match[1]);

	return null;
}

/**
 * Enhance person data with better extraction from text
 */
function enhancePersonData(
	person: Record<string, unknown>,
	originalText: string,
): Person {
	// Normalize the person data first
	const enhanced: Person = normalizePerson({
		...(person as unknown as Person),
	});

	// Extract location if missing or generic
	if (
		!enhanced.location ||
		enhanced.location === "Unknown" ||
		enhanced.location === "Unknown location" ||
		enhanced.location === ""
	) {
		const extractedLocation = extractLocationFromText(originalText);
		if (extractedLocation) {
			enhanced.location = extractedLocation;
		}
	}

	// Extract skills if missing
	if (
		!enhanced.skills ||
		enhanced.skills === "No skills listed" ||
		enhanced.skills === ""
	) {
		const extractedSkills = extractSkillsFromText(originalText);
		if (extractedSkills) {
			enhanced.skills = extractedSkills;
		}
	}

	// Extract experience if missing
	if (
		!enhanced.experience ||
		(typeof enhanced.experience === "number" && enhanced.experience === 0)
	) {
		const extractedExp = extractExperienceFromText(originalText);
		if (extractedExp !== null) {
			enhanced.experience = extractedExp;
		}
	}

	// Extract email if missing
	if (!enhanced.email) {
		const emailMatch = originalText.match(
			/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/,
		);
		if (emailMatch) {
			enhanced.email = emailMatch[1];
		}
	}

	return enhanced;
}

/**
 * Validate file extension matches declared type
 */
export function validateFileType(
	declaredType: "csv" | "json" | "text",
	fileExtension: string | undefined,
	fileName: string,
): { isValid: boolean; message: string } {
	if (!fileExtension) {
		return {
			isValid: false,
			message: `File "${fileName}" has no extension. Expected .${declaredType} file.`,
		};
	}

	const validExtensions: Record<string, string[]> = {
		csv: ["csv"],
		json: ["json"],
		text: ["txt", "md", "text"],
	};

	const allowedExtensions = validExtensions[declaredType];
	if (!allowedExtensions.includes(fileExtension)) {
		return {
			isValid: false,
			message: `File extension ".${fileExtension}" does not match declared type "${declaredType}". Expected: ${allowedExtensions.map((ext) => `.${ext}`).join(", ")}`,
		};
	}

	return { isValid: true, message: "File extension is valid" };
}

/**
 * Validate file content matches declared type
 */
export async function validateFileContent(
	declaredType: "csv" | "json" | "text",
	content: string,
): Promise<{ isValid: boolean; message: string }> {
	try {
		switch (declaredType) {
			case "csv": {
				// Check if content looks like CSV (has commas and reasonable structure)
				const lines = content.trim().split("\n");
				if (lines.length < 1) {
					return { isValid: false, message: "CSV file appears to be empty" };
				}

				// Check if first line has commas (header row)
				if (!lines[0].includes(",")) {
					return {
						isValid: false,
						message: "CSV file does not contain comma-separated values",
					};
				}

				return { isValid: true, message: "CSV content is valid" };
			}

			case "json": {
				// Try to parse as JSON
				try {
					JSON.parse(content);
					return { isValid: true, message: "JSON content is valid" };
				} catch (jsonError) {
					return {
						isValid: false,
						message: `Invalid JSON format: ${jsonError instanceof Error ? jsonError.message : "Unknown JSON error"}`,
					};
				}
			}

			case "text": {
				// Text files are generally always valid if they have content
				if (content.trim().length === 0) {
					return { isValid: false, message: "Text file appears to be empty" };
				}

				return { isValid: true, message: "Text content is valid" };
			}

			default:
				return {
					isValid: false,
					message: `Unknown file type: ${declaredType}`,
				};
		}
	} catch (error) {
		return {
			isValid: false,
			message: `Content validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
		};
	}
}

/**
 * Parse CSV content and return structured data
 */
export const parseCSV = (csvContent: string): CsvRow[] => {
	const parsedData = Papa.parse<CsvRow>(csvContent, {
		header: true,
		skipEmptyLines: true,
	});
	console.log(`        → Parsed CSV data: ${JSON.stringify(parsedData.data)}`);
	return parsedData.data.map((row) => row);
};

/**
 * Parse JSON content and return structured data
 */
export const parseJSON = (jsonContent: string): object => {
	try {
		const parsedData = JSON.parse(jsonContent);
		console.log(`        → Parsed JSON data:`, parsedData);
		return parsedData;
	} catch (error) {
		console.error("        ✗ JSON parsing error:", error);
		throw new Error("Invalid JSON content");
	}
};
/**
 * Processes a single file based on its type using existing parsers
 */
export async function processFile(
	file: FileInfo,
	context?: RunContext,
): Promise<ProcessedFile | null> {
	try {
		// Generate MD5 hash of the original file content
		const md5Hash = generateMD5(file.content);

		// Check if the file already exists in the appropriate collection
		// For people data, check in 'people' collection; for general documents, use 'documents'
		const collectionToCheck = "people"; // Since we're mainly processing person data
		const existsResult = await documentExistsByMD5(md5Hash, collectionToCheck);
		if (!existsResult.success) {
			console.warn(
				`Warning: Could not check document existence: ${existsResult.error}. Proceeding with processing...`,
			);
			// Continue processing instead of returning null
		}

		// If document already exists, return early
		if (existsResult.success && existsResult.data) {
			console.log(
				`        ⚬ Document ${file.name} already exists (MD5: ${md5Hash})`,
			);
			return {
				fileName: file.name,
				filePath: file.path,
				dataType: file.type,
				md5Hash,
				alreadyExists: true,
				storedInQdrant: false,
			};
		}

		// Process the file based on its type
		let processedData: object;

		switch (file.type) {
			case "csv": {
				processedData = parseCSV(file.content);
				break;
			}
			case "json": {
				processedData = parseJSON(file.content);
				break;
			}
			case "text": {
				// Define interface for person extraction
				const personInterface = `
					interface Person {
						name: string;
						location: string;
						role?: string;
						skills?: string[];
						experience?: string;
						email?: string;
					}
				`;

				try {
					const result = await convertTextToJson(
						file.content,
						personInterface,
						"person profile information",
					);
					if (result.success && result.data) {
						processedData = result.data;
					} else {
						throw new Error(result.error || "AI conversion failed");
					}
				} catch (error) {
					console.error("        ✗ AI text extraction error:", error);
					// Fallback: create empty object with expected keys
					const keys = extractKeysFromInterface(personInterface);
					const fallback: Record<string, string> = {};
					for (const key of keys) {
						fallback[key] = "";
					}
					processedData = fallback;
				}
				break;
			}
			default:
				console.warn(`Unknown file type: ${file.type}`);
				return null;
		}

		// Extract and store individual entities instead of entire file
		const runContext: RunContext = context ?? {
			dupes: 0,
			bads: 0,
			maxDupes: 3,
			maxBads: 7,
		};
		const entityResults = await extractAndStoreEntities(
			file.content,
			processedData,
			{
				fileName: file.name,
				filePath: file.path,
				dataType: file.type,
				processedAt: new Date().toISOString(),
			},
			runContext,
		);

		if (entityResults.length === 0) {
			console.error(`        ✗ No entities extracted from ${file.name}`);
			return {
				fileName: file.name,
				filePath: file.path,
				dataType: file.type,
				md5Hash,
				alreadyExists: false,
				storedInQdrant: false,
				processedData,
			};
		}

		// Check if all entities were stored successfully
		const allStored = entityResults.every((result) => result.storedInQdrant);

		console.log(
			`        ✓ Processed and stored ${entityResults.length} entities from ${file.name} (MD5: ${md5Hash})`,
		);

		return {
			fileName: file.name,
			filePath: file.path,
			dataType: file.type,
			md5Hash,
			alreadyExists: false,
			storedInQdrant: allStored,
			processedData,
		};
	} catch (error) {
		console.error(`        ✗ Error processing file ${file.name}:`, error);
		return null;
	}
}

/**
 * Processes multiple files in parallel
 */
export async function processFiles(
	files: FileInfo[],
): Promise<ProcessedFile[]> {
	const processedFiles: ProcessedFile[] = [];
	// Create a shared run context to enforce caps across the whole run
	const context: RunContext = { dupes: 0, bads: 0, maxDupes: 3, maxBads: 7 };

	for (const file of files) {
		const result = await processFile(file, context);
		if (result) {
			processedFiles.push(result);
		}
	}

	console.log(
		`    ⏺ Run summary: processed ${processedFiles.length} files, duplicates encountered: ${context.dupes}, bad entries encountered: ${context.bads} (caps dupes<=${context.maxDupes}, bads<=${context.maxBads})`,
	);

	return processedFiles;
}

/**
 * Store processed file data
 */
export function storeProcessedData(data: ProcessedFile[]): void {
	processedDataStore = [...data];
	console.log(`    ✓ Stored ${data.length} processed files in data store`);
}

/**
 * Get statistics about the data store
 */
export function getDataStoreStats(): {
	totalFiles: number;
	filesByType: Record<string, number>;
	totalSizeEstimate: number;
} {
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
}

/**
 * Complete file upload handler with validation and processing
 * @param file - The uploaded file
 * @param fileType - The declared type of file (csv, json, text)
 */
export const processFileUpload = async (
	file: File,
	fileType: "csv" | "json" | "text",
): Promise<{
	success: boolean;
	message: string;
	data?: object;
	error?: string;
}> => {
	try {
		// Validate inputs
		if (!file) {
			return {
				success: false,
				message: "No file provided",
				error: "File is required",
			};
		}

		if (!fileType || !["csv", "json", "text"].includes(fileType)) {
			return {
				success: false,
				message: "Invalid file type",
				error: "File type must be csv, json, or text",
			};
		}

		// Validate file extension matches declared type
		const fileName = file.name || "";
		const fileExtension = fileName.split(".").pop()?.toLowerCase();

		const extensionValidation = validateFileType(
			fileType,
			fileExtension,
			fileName,
		);
		if (!extensionValidation.isValid) {
			return {
				success: false,
				message: "File type mismatch",
				error: extensionValidation.message,
			};
		}

		// Read file content
		const content = await file.text();

		// Validate file content matches declared type
		const contentValidation = await validateFileContent(fileType, content);
		if (!contentValidation.isValid) {
			return {
				success: false,
				message: "File content validation failed",
				error: contentValidation.message,
			};
		}

		// Create FileInfo object for processing
		const fileInfo: FileInfo = {
			path: `./uploads/${fileName}`,
			name: fileName,
			type: fileType,
			content: content,
		};

		// Process the file using the existing parser service
		const result = await processFile(fileInfo);

		if (!result) {
			return {
				success: false,
				message: `Failed to process ${fileType} file`,
				error: "Processing returned null",
			};
		}

		return {
			success: true,
			message: `${fileType.toUpperCase()} file processed successfully`,
			data: {
				fileName: result.fileName,
				dataType: result.dataType,
				md5Hash: result.md5Hash,
				alreadyExists: result.alreadyExists,
				storedInQdrant: result.storedInQdrant,
				processedData: result.processedData,
			},
		};
	} catch (error) {
		console.error(`Error processing ${fileType} file:`, error);
		return {
			success: false,
			message: "Internal server error during file processing",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// =============================================================================
// STATIC FILE HANDLING FUNCTIONS
// =============================================================================

/**
 * Configuration for static data loading
 */
const STATIC_DATA_PATH = path.join(process.cwd(), "static-data");

/**
 * Scans the static-data folder and returns file information
 */
export async function scanStaticDataFolder(): Promise<FileInfo[]> {
	const files: FileInfo[] = [];

	try {
		const csvDir = path.join(STATIC_DATA_PATH, "csv");
		const jsonDir = path.join(STATIC_DATA_PATH, "json");
		const textDir = path.join(STATIC_DATA_PATH, "text");

		// Process CSV files
		if (await directoryExists(csvDir)) {
			const csvFiles = await getFilesFromDirectory(csvDir, "csv");
			files.push(...csvFiles);
		}

		// Process JSON files
		if (await directoryExists(jsonDir)) {
			const jsonFiles = await getFilesFromDirectory(jsonDir, "json");
			files.push(...jsonFiles);
		}

		// Process text files
		if (await directoryExists(textDir)) {
			const textFiles = await getFilesFromDirectory(textDir, "text");
			files.push(...textFiles);
		}

		return files;
	} catch (error) {
		console.error("        ✗ Error scanning static data folder:", error);
		return [];
	}
}

/**
 * Gets files from a directory and validates their type
 */
async function getFilesFromDirectory(
	dirPath: string,
	type: "csv" | "json" | "text",
): Promise<FileInfo[]> {
	const files: FileInfo[] = [];

	try {
		const entries = await fs.readdir(dirPath);

		for (const entry of entries) {
			const filePath = path.join(dirPath, entry);
			const stats = await fs.stat(filePath);

			if (stats.isFile() && isValidFileType(entry, type)) {
				const content = await fs.readFile(filePath, "utf-8");
				files.push({
					path: filePath,
					name: entry,
					type,
					content,
				});
			}
		}
	} catch (error) {
		console.error(`        ✗ Error reading directory ${dirPath}:`, error);
	}

	return files;
}

/**
 * Validates if a file matches the expected type
 */
function isValidFileType(
	fileName: string,
	expectedType: "csv" | "json" | "text",
): boolean {
	const extension = path.extname(fileName).toLowerCase();

	switch (expectedType) {
		case "csv":
			return extension === ".csv";
		case "json":
			return extension === ".json";
		case "text":
			return [".txt", ".md"].includes(extension);
		default:
			return false;
	}
}

/**
 * Checks if a directory exists
 */
async function directoryExists(dirPath: string): Promise<boolean> {
	try {
		const stats = await fs.stat(dirPath);
		return stats.isDirectory();
	} catch {
		return false;
	}
}

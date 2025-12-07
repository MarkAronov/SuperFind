import { convertTextToJson } from "../ai";
import { extractKeysFromInterface } from "../utils/interface-parser";
import { log } from "../utils/logger";
import { extractAndStoreEntities } from "./entity-storage";
import { parseCSV, parseJSON } from "./file-parsers";
import { validateFileContent, validateFileType } from "./file-validators";
import type { FileInfo, ProcessedFile, RunContext } from "./types";

/**
 * Main parser service - orchestrates file processing pipeline
 * Coordinates validation, parsing, entity extraction, and storage
 */

/**
 * Processes a single file based on its type using existing parsers
 */
export const processFile = async (
	file: FileInfo,
	context?: RunContext,
): Promise<ProcessedFile | null> => {
	try {
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
					log("PARSER_AI_EXTRACTION_ERROR", { error: String(error) }, 2);
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
				log("PARSER_UNKNOWN_TYPE", { type: file.type });
				return null;
		}

		// Extract and store individual entities instead of entire file
		const runContext: RunContext = context ?? {
			dupes: 0,
			bads: 0,
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
			log("PARSER_NO_ENTITIES", { fileName: file.name }, 2);
			return {
				fileName: file.name,
				filePath: file.path,
				dataType: file.type,
				alreadyExists: false,
				storedInQdrant: false,
				processedData,
			};
		}

		// Check if all entities were stored successfully
		const allStored = entityResults.every((result) => result.storedInQdrant);

		log(
			"PARSER_ENTITIES_STORED",
			{
				count: entityResults.length.toString(),
				fileName: file.name,
			},
			2,
		);

		return {
			fileName: file.name,
			filePath: file.path,
			dataType: file.type,
			alreadyExists: false,
			storedInQdrant: allStored,
			processedData,
		};
	} catch (error) {
		log("PARSER_FILE_ERROR", { fileName: file.name, error: String(error) }, 2);
		return null;
	}
};

/**
 * Processes multiple files in parallel
 */
export const processFiles = async (
	files: FileInfo[],
): Promise<ProcessedFile[]> => {
	const processedFiles: ProcessedFile[] = [];
	// Shared run context to track duplicates/invalid records across entire run
	const context: RunContext = { dupes: 0, bads: 0 };

	for (const file of files) {
		const result = await processFile(file, context);
		if (result) {
			processedFiles.push(result);
		}
	}

	log(
		"PARSER_RUN_SUMMARY",
		{
			filesCount: processedFiles.length.toString(),
			dupes: context.dupes.toString(),
			bads: context.bads.toString(),
		},
		1,
	);

	return processedFiles;
};

// Re-export functions from other services for backward compatibility
export {
	getDataStoreStats,
	storeProcessedData,
} from "./entity-storage";
export { parseCSV, parseJSON } from "./file-parsers";
export { scanStaticDataFolder } from "./file-scanner";
export {
	validateFileContent,
	validateFileType,
} from "./file-validators";

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
				alreadyExists: result.alreadyExists,
				storedInQdrant: result.storedInQdrant,
				processedData: result.processedData,
			},
		};
	} catch (error) {
		log("PARSER_UPLOAD_ERROR", { fileType, error: String(error) });
		return {
			success: false,
			message: "Internal server error during file processing",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

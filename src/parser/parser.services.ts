import { promises as fs } from "fs";
import * as Papa from "papaparse";
import * as path from "path";
import { convertTextToJson } from "../ai/ai.services";
import {
	documentExistsByMD5,
	generateMD5,
	storeDocument,
} from "../vector/qdrant.services";

/**
 * Comprehensive file parser service - handles CSV, JSON, and Text parsing
 * for both uploaded files and static files
 */

// Type definitions
type CsvRow = Record<string, string>;

interface FileInfo {
	path: string;
	name: string;
	type: "csv" | "json" | "text";
	content: string;
}

interface ProcessedFile {
	fileName: string;
	filePath: string;
	dataType: "csv" | "json" | "text";
	md5Hash: string;
	alreadyExists: boolean;
	storedInQdrant: boolean;
	processedData?: object;
}

// In-memory storage for processed data (could be replaced with database)
let processedDataStore: ProcessedFile[] = [];

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
	console.log(`Parsed CSV data: ${JSON.stringify(parsedData.data)}`);
	return parsedData.data.map((row) => row);
};

/**
 * Parse JSON content and return structured data
 */
export const parseJSON = (jsonContent: string): object => {
	try {
		const parsedData = JSON.parse(jsonContent);
		console.log(`Parsed JSON data:`, parsedData);
		return parsedData;
	} catch (error) {
		console.error("JSON parsing error:", error);
		throw new Error("Invalid JSON content");
	}
};

/**
 * Convert text to JSON using dynamic AI service with interface-driven keys
 * @param textContent - Raw text content to parse
 * @param targetInterface - TypeScript interface string defining the expected JSON structure
 * @param extractionHint - Optional hint about what data to extract (e.g., "people", "contacts")
 */
export const convertTextToJSON = async (
	textContent: string,
	targetInterface: string,
	extractionHint?: string,
): Promise<object> => {
	try {
		// Use the AI service to convert text to JSON
		const result = await convertTextToJson(
			textContent,
			targetInterface,
			extractionHint,
		);

		if (result.success && result.data) {
			return result.data;
		} else {
			throw new Error(result.error || "AI conversion failed");
		}
	} catch (error) {
		console.error("AI text extraction error:", error);

		// Fallback: create empty object with expected keys
		const interfaceKeys = extractKeysFromInterface(targetInterface);
		const fallback: Record<string, string> = {};
		for (const key of interfaceKeys) {
			fallback[key] = "";
		}
		return fallback;
	}
};

/**
 * Extract property keys from TypeScript interface string
 * e.g., "interface Person { name: string; email: string; }" -> ["name", "email"]
 */
const extractKeysFromInterface = (interfaceString: string): string[] => {
	const propertyRegex = /(\w+)(?:\?)?\s*:/g;
	const keys: string[] = [];
	let match: RegExpExecArray | null;

	while (true) {
		match = propertyRegex.exec(interfaceString);
		if (match === null) break;
		keys.push(match[1]);
	}

	return keys;
};

/**
 * Processes a single file based on its type using existing parsers
 */
export async function processFile(
	file: FileInfo,
): Promise<ProcessedFile | null> {
	try {
		// Generate MD5 hash of the original file content
		const md5Hash = generateMD5(file.content);

		// Check if the file already exists in Qdrant
		const existsResult = await documentExistsByMD5(md5Hash);
		if (!existsResult.success) {
			console.warn(
				`Warning: Could not check document existence: ${existsResult.error}. Proceeding with processing...`,
			);
			// Continue processing instead of returning null
		}

		// If document already exists, return early
		if (existsResult.success && existsResult.data) {
			console.log(
				`✓ Document ${file.name} already exists in Qdrant (MD5: ${md5Hash})`,
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
					}
				`;

				processedData = await convertTextToJSON(
					file.content,
					personInterface,
					"person profile information",
				);
				break;
			}
			default:
				console.warn(`Unknown file type: ${file.type}`);
				return null;
		}

		// Store the processed document in Qdrant
		const storeResult = await storeDocument(file.content, processedData, {
			fileName: file.name,
			filePath: file.path,
			dataType: file.type,
			processedAt: new Date().toISOString(),
		});

		if (!storeResult.success) {
			console.error(`Error storing document in Qdrant: ${storeResult.error}`);
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

		console.log(
			`✓ Processed and stored ${file.name} in Qdrant (MD5: ${md5Hash})`,
		);

		return {
			fileName: file.name,
			filePath: file.path,
			dataType: file.type,
			md5Hash,
			alreadyExists: false,
			storedInQdrant: true,
			processedData,
		};
	} catch (error) {
		console.error(`Error processing file ${file.name}:`, error);
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

	for (const file of files) {
		const result = await processFile(file);
		if (result) {
			processedFiles.push(result);
		}
	}

	return processedFiles;
}

/**
 * Store processed file data
 */
export function storeProcessedData(data: ProcessedFile[]): void {
	processedDataStore = [...data];
	console.log(`[STORE] Stored ${data.length} processed files in data store`);
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

		console.log(`[SCAN] Found ${files.length} files to process`);
		return files;
	} catch (error) {
		console.error("Error scanning static data folder:", error);
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
		console.error(`Error reading directory ${dirPath}:`, error);
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

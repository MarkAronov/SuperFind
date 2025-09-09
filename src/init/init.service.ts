import { promises as fs } from "fs";
import * as Papa from "papaparse";
import * as path from "path";
import type {
	CsvProcessingResult,
	FileInfo,
	JsonProcessingResult,
	ProcessedFileData,
} from "./init.interfaces";

// Configuration
const STATIC_DATA_PATH = path.join(process.cwd(), "static-data");

/**
 * Main initialization function - scans static-data folder and processes all files
 */
export async function initialize(): Promise<ProcessedFileData[]> {
	try {
		console.log("🚀 Starting initialization of static data...");

		const files = await scanStaticDataFolder();
		console.log(`📁 Found ${files.length} files to process`);

		const processedFiles: ProcessedFileData[] = [];

		for (const file of files) {
			try {
				const processedData = await processFile(file);
				if (processedData) {
					// TODO: You will implement this function
					await addToVectorMemory(processedData);
					processedFiles.push(processedData);
					console.log(`✅ Processed: ${file.name}`);
				}
			} catch (error) {
				console.error(`❌ Error processing ${file.name}:`, error);
			}
		}

		console.log(
			`🎉 Initialization complete! Processed ${processedFiles.length} files`,
		);
		return processedFiles;
	} catch (error) {
		console.error("❌ Initialization failed:", error);
		throw error;
	}
}

/**
 * Scans the static-data folder and returns file information
 */
const scanStaticDataFolder = async (): Promise<FileInfo[]> => {
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
	} catch (error) {
		console.error("Error scanning static-data folder:", error);
	}

	return files;
};

/**
 * Gets files from a specific directory
 */
const getFilesFromDirectory = async (
	dirPath: string,
	type: "csv" | "json" | "text",
): Promise<FileInfo[]> => {
	const files: FileInfo[] = [];

	try {
		const items = await fs.readdir(dirPath);

		for (const item of items) {
			const itemPath = path.join(dirPath, item);
			const stats = await fs.stat(itemPath);

			if (stats.isFile() && isValidFileType(item, type)) {
				const content = await fs.readFile(itemPath, "utf-8");
				files.push({
					path: itemPath,
					name: item,
					type,
					content,
				});
			}
		}
	} catch (error) {
		console.error(`Error reading directory ${dirPath}:`, error);
	}

	return files;
};

/**
 * Validates if a file matches the expected type
 */
const isValidFileType = (
	fileName: string,
	expectedType: "csv" | "json" | "text",
): boolean => {
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
};

/**
 * Checks if a directory exists
 */
const directoryExists = async (dirPath: string): Promise<boolean> => {
	try {
		const stats = await fs.stat(dirPath);
		return stats.isDirectory();
	} catch {
		return false;
	}
};

/**
 * Processes a single file based on its type
 */
const processFile = async (
	file: FileInfo,
): Promise<ProcessedFileData | null> => {
	switch (file.type) {
		case "csv":
			return processCsvFile(file);
		case "json":
			return processJsonFile(file);
		case "text":
			return processTextFile(file);
		default:
			console.warn(`Unknown file type: ${file.type}`);
			return null;
	}
};

/**
 * Processes CSV files
 */
const processCsvFile = (file: FileInfo): ProcessedFileData => {
	const parsedData = Papa.parse(file.content, {
		header: true,
		skipEmptyLines: true,
		dynamicTyping: true,
	});

	const csvResult: CsvProcessingResult = {
		headers: parsedData.meta.fields || [],
		rows: parsedData.data as Record<string, string | number | boolean>[],
		metadata: {
			rowCount: parsedData.data.length,
			columnCount: parsedData.meta.fields?.length || 0,
		},
	};

	return {
		fileName: file.name,
		filePath: file.path,
		dataType: "csv",
		processedContent: csvResult,
	};
};

/**
 * Processes JSON files
 */
const processJsonFile = (file: FileInfo): ProcessedFileData => {
	const jsonData = JSON.parse(file.content);

	const keys = Array.isArray(jsonData)
		? jsonData.length > 0
			? Object.keys(jsonData[0])
			: []
		: Object.keys(jsonData);

	const jsonResult: JsonProcessingResult = {
		data: jsonData,
		metadata: {
			keys,
			dataType: Array.isArray(jsonData) ? "array" : "object",
			itemCount: Array.isArray(jsonData) ? jsonData.length : undefined,
		},
	};

	return {
		fileName: file.name,
		filePath: file.path,
		dataType: "json",
		processedContent: jsonResult,
	};
};

/**
 * TODO: YOU WILL IMPLEMENT THIS
 * Processes text files - left for you to implement
 */
const processTextFile = (file: FileInfo): ProcessedFileData => {
	// TODO: Implement your text processing logic here
	// This should handle .txt and .md files from the text folder
	// You might want to:
	// - Extract key information
	// - Split into chunks
	// - Clean the text
	// - etc.

	console.log(`📝 Processing text file: ${file.name}`);

	return {
		fileName: file.name,
		filePath: file.path,
		dataType: "text",
		processedContent: file.content, // For now, just return raw content
	};
};

/**
 * TODO: YOU WILL IMPLEMENT THIS
 * Adds processed data to vector memory - left for you to implement
 */
const addToVectorMemory = async (
	processedData: ProcessedFileData,
): Promise<void> => {
	// TODO: Implement your vector storage logic here
	// This should:
	// - Convert the processed data to vectors
	// - Store in your vector database
	// - Update the vectorData property
	// - etc.

	console.log(`🧠 Adding to vector memory: ${processedData.fileName}`);

	// Placeholder - remove when you implement
	processedData.vectorData = {
		status: "pending_implementation",
		fileName: processedData.fileName,
	};
};

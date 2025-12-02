import * as fs from "node:fs/promises";
import * as path from "node:path";
import { log } from "../utils/logger";
import type { FileInfo } from "./types";

/**
 * File scanner service - handles static file system operations
 * for scanning and loading files from the static-data directory
 */

/**
 * Configuration for static data loading
 */
const STATIC_DATA_PATH = path.join(process.cwd(), "static-data");

/**
 * Scans the static-data folder and returns file information
 */
export const scanStaticDataFolder = async (): Promise<FileInfo[]> => {
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
		log("PARSER_SCAN_ERROR", { error: String(error) }, 2);
		return [];
	}
};

/**
 * Gets files from a directory and validates their type
 */
const getFilesFromDirectory = async (
	dirPath: string,
	type: "csv" | "json" | "text",
): Promise<FileInfo[]> => {
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
		log("PARSER_DIR_READ_ERROR", { path: dirPath, error: String(error) }, 2);
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

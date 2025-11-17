/**
 * Type definitions for parser service
 * Separated from parser.services.ts for cleaner organization
 */

/**
 * CSV row - generic key-value record
 */
export type CsvRow = Record<string, string>;

/**
 * Individual entity extracted from file data
 */
export interface EntityResult {
	id: string;
	content: string;
	entityType: "person" | "organization" | "location";
	storedInQdrant: boolean;
	metadata: Record<string, unknown>;
}

/**
 * File information for processing
 */
export interface FileInfo {
	path: string;
	name: string;
	type: "csv" | "json" | "text";
	content: string;
}

/**
 * Processed file result with metadata and status
 */
export interface ProcessedFile {
	fileName: string;
	filePath: string;
	dataType: "csv" | "json" | "text";
	md5Hash: string;
	alreadyExists: boolean;
	storedInQdrant: boolean;
	processedData?: object;
}

/**
 * Run-level context to track duplicates and bad entries across batch processing
 */
export interface RunContext {
	dupes: number; // number of duplicate person entries encountered
	bads: number; // number of invalid person entries encountered
	maxDupes: number; // maximum allowed duplicates across the run
	maxBads: number; // maximum allowed bad entries across the run
}

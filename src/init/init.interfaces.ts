export interface FileInfo {
	path: string;
	name: string;
	type: "csv" | "json" | "text";
	content: string;
}

export interface ProcessedFileData {
	fileName: string;
	filePath: string;
	dataType: "csv" | "json" | "text";
	processedContent: CsvProcessingResult | JsonProcessingResult | string;
	vectorData?: unknown; // This will be populated by your vector storage function
}

export interface CsvProcessingResult {
	headers: string[];
	rows: Record<string, string | number | boolean>[];
	metadata: {
		rowCount: number;
		columnCount: number;
	};
}

export interface JsonProcessingResult {
	data: Record<string, unknown> | unknown[];
	metadata: {
		keys: string[];
		dataType: string;
		itemCount?: number;
	};
}

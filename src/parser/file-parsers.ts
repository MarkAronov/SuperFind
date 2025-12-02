import * as Papa from "papaparse";
import { log } from "../utils/logger";
import type { CsvRow } from "./types";

/**
 * File parsers service - handles parsing of different file formats
 * (CSV, JSON) into structured data
 */

/**
 * Parse CSV content and return structured data
 */
export const parseCSV = (csvContent: string): CsvRow[] => {
	const parsedData = Papa.parse<CsvRow>(csvContent, {
		header: true,
		skipEmptyLines: true,
	});
	log(
		"PARSER_CSV_PARSED",
		{ preview: JSON.stringify(parsedData.data).substring(0, 100) },
		2,
	);
	return parsedData.data.map((row) => row);
};

/**
 * Parse JSON content and return structured data
 */
export const parseJSON = (jsonContent: string): object => {
	try {
		const parsedData = JSON.parse(jsonContent);
		log(
			"PARSER_JSON_PARSED",
			{ preview: JSON.stringify(parsedData).substring(0, 100) },
			2,
		);
		return parsedData;
	} catch (error) {
		log("PARSER_JSON_ERROR", { error: String(error) }, 2);
		throw new Error("Invalid JSON content");
	}
};

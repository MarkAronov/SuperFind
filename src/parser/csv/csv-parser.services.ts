import * as Papa from "papaparse";
import { saveFile } from "../../utils";
import type { CsvRow } from "./csv-parser.interfaces";

// Service logic for CSV parser users
export const parseAndSaveCSV = (csvContent: string): string => {
	const parsedData = Papa.parse<CsvRow>(csvContent, {
		header: true,
		skipEmptyLines: true,
	});
	console.log(`Parsed CSV data: ${JSON.stringify(parsedData.data)}`);
	// Process each row without validation
	const processedData = parsedData.data.map((row) => row);

	const outputFilePath = saveFile("csv", "output", processedData);
	return outputFilePath;
};

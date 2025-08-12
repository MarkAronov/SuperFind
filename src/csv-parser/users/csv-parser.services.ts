import * as Papa from "papaparse";
import * as path from "path";
import { saveFile } from "../../utils";
import type { CsvRow } from "./";

// Service logic for CSV parser users
export const parseAndSaveCSV = (csvContent: string): string => {
	const parsedData = Papa.parse<CsvRow>(csvContent, {header : true, skipEmptyLines: true});
	console.log(`Parsed CSV data: ${JSON.stringify(parsedData.data)}`);
	// Process each row without validation
	const processedData = parsedData.data.map((row) => row);

	const outputDir = path.join(process.cwd(), ".", "output");

	const outputFilePath = path.join(outputDir, "output.json");

	saveFile(outputDir, outputFilePath, processedData);
	return outputFilePath;
};

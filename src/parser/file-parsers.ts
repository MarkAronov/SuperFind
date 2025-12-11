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

	let records = parsedData.data;
	const headerFields = parsedData.meta.fields;

	// Check for malformed rows (length mismatch) or if we suspect column shifting
	// We check if any row has a different number of keys than the header
	if (headerFields && headerFields.length === 7) {
		const malformed = records.some(
			(r) => Object.keys(r).length !== headerFields.length,
		);

		if (malformed) {
			log(
				"PARSER_CSV_MALFORMED_DETECTED",
				{ count: records.length.toString() },
				2,
			);
			// Repair logic based on email position heuristic
			const lines = csvContent
				.split(/\r?\n/)
				.filter((l) => l.trim().length > 0);
			// Skip header
			lines.shift();

			const repaired: CsvRow[] = [];

			for (const ln of lines) {
				const parts = ln.split(",");
				// Find email by @ symbol
				const idxEmail = parts.findIndex((p) => /@/.test(p));

				if (idxEmail > 0) {
					// Reconstruct based on email position
					// Expected: name, location, role, skills, experience_years, email, description
					// location is at index 1, but might span multiple parts if it contained commas
					// email is at idxEmail
					// experience is at idxEmail - 1
					// skills is at idxEmail - 2
					// role is at idxEmail - 3
					// name is at 0
					// location is parts.slice(1, idxEmail - 3).join(",")
					// description is parts.slice(idxEmail + 1).join(",")

					const email = parts[idxEmail].trim();
					const experience_years = parts[idxEmail - 1]?.trim() || "";
					const skills = parts[idxEmail - 2]?.trim() || "";
					const role = parts[idxEmail - 3]?.trim() || "";
					const name = parts[0].trim();
					const location = parts
						.slice(1, idxEmail - 3)
						.join(",")
						.trim();
					const description = parts
						.slice(idxEmail + 1)
						.join(",")
						.trim();

					repaired.push({
						name,
						location,
						role,
						skills,
						experience_years,
						email,
						description,
					});
				} else {
					// Fallback: try to parse with Papa for this line
					const p = Papa.parse<string[]>(ln, {
						header: false,
						skipEmptyLines: true,
					});
					const row = p.data?.[0];
					if (row && row.length === 7) {
						repaired.push({
							name: row[0],
							location: row[1],
							role: row[2],
							skills: row[3],
							experience_years: row[4],
							email: row[5],
							description: row[6],
						});
					}
				}
			}

			if (repaired.length > 0) {
				records = repaired;
				log("PARSER_CSV_REPAIRED", { count: repaired.length.toString() }, 2);
			}
		}
	}

	log(
		"PARSER_CSV_PARSED",
		{ preview: JSON.stringify(records).substring(0, 100) },
		2,
	);
	return records;
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

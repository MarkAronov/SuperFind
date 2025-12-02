#!/usr/bin/env node
// Validate CSVs in static-data/csv for consistent columns and basic types
// Usage: node scripts/validate-csv.js
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const CSV_DIR = path.resolve(__dirname, "..", "static-data", "csv");

function isEmail(s) {
	if (!s) return false;
	return /^\S+@\S+\.\S+$/.test(s);
}

function validateFile(filePath) {
	const content = fs.readFileSync(filePath, "utf8");
	const parsed = Papa.parse(content, {
		header: true,
		skipEmptyLines: true,
		dynamicTyping: false,
	});
	let records = parsed.data;
	// If parsing produced fields but rows mismatch (likely due to unquoted commas), try to repair using heuristic
	const headerFields = parsed.meta?.fields ?? null;
	if (headerFields && headerFields.length === 7) {
		const malformed = records.some(
			(r) => Object.keys(r).length !== headerFields.length,
		);
		if (malformed) {
			const lines = content.split(/\r?\n/).filter(Boolean);
			lines.shift();
			const repaired = [];
			lines.forEach((ln) => {
				const parts = ln.split(",");
				const idxEmail = parts.findIndex((p) => /@/.test(p));
				if (idxEmail > 0) {
					const email = parts[idxEmail];
					const exp = parts[idxEmail - 1];
					const skills = parts[idxEmail - 2];
					const role = parts[idxEmail - 3];
					const name = parts[0];
					const location = parts.slice(1, idxEmail - 3).join(",");
					const description = parts.slice(idxEmail + 1).join(",");
					repaired.push({
						name,
						location,
						role,
						skills,
						experience_years: exp,
						email,
						description,
					});
				} else {
					const p = Papa.parse(ln, { header: false, skipEmptyLines: true });
					const row = p.data?.[0] ?? null;
					if (row && row.length === 7)
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
			});
			if (repaired.length) records = repaired;
		}
	}
	if (records.length === 0) return { ok: true, errors: [] };
	const required = [
		"name",
		"location",
		"role",
		"skills",
		"experience_years",
		"email",
		"description",
	];
	const header = Object.keys(records[0]);
	const missingRequired = required.filter((r) => !header.includes(r));
	const errors = [];
	if (missingRequired.length) {
		errors.push(`Missing required columns: ${missingRequired.join(", ")}`);
		return { ok: false, errors };
	}
	records.forEach((row, i) => {
		const rIndex = i + 2; // line number with header
		// Check required values
		required.forEach((k) => {
			if (row[k] === undefined || row[k] === "")
				errors.push(`Line ${rIndex}: Missing value for ${k}`);
		});
		// email
		if (row.email && !isEmail(row.email))
			errors.push(`Line ${rIndex}: Invalid email ${row.email}`);
		// experience_years numeric
		const exp = row.experience_years;
		if (exp && Number.isNaN(Number(exp)))
			errors.push(`Line ${rIndex}: experience_years not a number: ${exp}`);
	});
	return { ok: errors.length === 0, errors };
}

function main() {
	const files = fs.readdirSync(CSV_DIR).filter((f) => f.endsWith(".csv"));
	let totalErrors = 0;
	files.forEach((f) => {
		const result = validateFile(path.join(CSV_DIR, f));
		if (!result.ok) {
			totalErrors += result.errors.length;
			console.error("\n" + f + " validation errors:");
			result.errors.forEach((e) => console.error("  -", e));
		} else {
			console.log(f + ": OK");
		}
	});
	if (totalErrors > 0) {
		console.error("\nTotal errors:", totalErrors);
		process.exit(2);
	} else {
		console.log("\nAll CSV files validated");
	}
}

main();

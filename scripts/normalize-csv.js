#!/usr/bin/env node
// Normalize CSVs under static-data/csv to consistent quoting and ordering.
// Usage: node scripts/normalize-csv.js [--inplace]
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

// Normalization uses Papa.unparse; no manual quoting required.

// Using Papa.unparse provides a robust, consistent CSV output.

function normalizeFile(filePath, inplace) {
	const content = fs.readFileSync(filePath, "utf8");
	const parsed = Papa.parse(content, {
		header: true,
		skipEmptyLines: true,
		dynamicTyping: false,
	});
	let records = parsed.data;
	// If lines parsed incorrectly (malformed CSV e.g., unquoted commas in location), try to repair
	const headerFields = parsed.meta?.fields ?? null;
	if (headerFields && headerFields.length === 7) {
		// validate lengths; if any record has more keys than header, fallback to repair
		const malformed = records.some(
			(r) => Object.keys(r).length !== headerFields.length,
		);
		if (malformed) {
			// Repair line-by-line using email location heuristic
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
					// Fallback: try to parse with Papa
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
	if (records.length === 0) return false;
	// Use Papa.unparse to generate consistent CSV (quote all fields)
	const normalized = Papa.unparse(records, { header: true, quotes: true });
	if (normalized !== content) {
		const backup = filePath + ".bak";
		if (!fs.existsSync(backup)) fs.writeFileSync(backup, content, "utf8");
		if (inplace) fs.writeFileSync(filePath, normalized, "utf8");
		return true;
	}
	return false;
}

function main() {
	const args = process.argv.slice(2);
	const inplace = args.includes("--inplace");
	const csvDir = path.resolve(__dirname, "..", "static-data", "csv");
	const files = fs.readdirSync(csvDir).filter((f) => f.endsWith(".csv"));
	const changed = [];
	files.forEach((f) => {
		const full = path.join(csvDir, f);
		try {
			const did = normalizeFile(full, inplace);
			if (did) changed.push(f);
		} catch (err) {
			console.error("Failed to normalize", f, err.message);
		}
	});
	console.log("Checked", files.length, "files. Normalized:", changed.length);
	if (changed.length) console.log("Files changed:", changed.join(", "));
}

main();

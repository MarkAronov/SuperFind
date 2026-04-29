#!/usr/bin/env node
/**
 * CommonJS Axe + Puppeteer runner to support Node with type: module.
 * Launches a headless browser, injects axe-core, runs an accessibility audit,
 * and saves the JSON report to the lighthouse/ output directory.
 *
 * Usage: node scripts/axe-run.cjs <URL>
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const axeSource = require("axe-core").source;

// Main runner — opens the URL, injects axe-core, and collects the audit result
const run = async (url) => {
	// Launch headless browser with sandbox flags suitable for CI environments
	const browser = await puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const page = await browser.newPage();

	// Navigate to the target URL and wait until network is idle
	await page.goto(url, { waitUntil: "networkidle0" });

	// Inject axe-core library into the page context
	await page.evaluate(axeSource);

	// Run the full axe accessibility audit and collect results
	const result = await page.evaluate(async () => await window.axe.run());

	// Ensure the output directory exists before writing the report
	const outDir = path.resolve(__dirname, "..", "lighthouse");
	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

	// Generate a timestamped filename so reports don't overwrite each other
	const ts = new Date().toISOString().replace(/[:.]/g, "-");
	const jsonPath = path.join(outDir, `axe-${ts}.json`);

	// Persist the full axe result as JSON for later review
	fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
	await browser.close();

	// Print summary to stdout
	console.log("Axe report saved to", jsonPath);
	console.log("Violations:", result.violations.length);

	// Log each violation with its impact level and affected nodes, then exit with code 2
	if (result.violations.length > 0) {
		result.violations.forEach((v) => {
			console.log(`\n${v.id} - ${v.impact} - ${v.help}`);
			v.nodes.forEach((n) => {
				console.log(`  - ${n.target.join(", ")}`);
			});
		});
		process.exit(2);
	}
};

// Parse CLI arguments — require exactly one URL argument
const args = process.argv.slice(2);
if (args.length < 1) {
	console.error("Usage: node scripts/axe-run.cjs <URL>");
	process.exit(1);
}

// Execute the runner and handle any unexpected errors
run(args[0]).catch((err) => {
	console.error(err);
	process.exit(1);
});

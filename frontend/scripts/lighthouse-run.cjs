#!/usr/bin/env node
/**
 * CommonJS Lighthouse runner for environments with "type": "module".
 * Launches Chromium via chrome-launcher, runs Lighthouse against the given URL,
 * and saves HTML + JSON reports to the lighthouse/ output directory.
 *
 * Usage: node scripts/lighthouse-run.cjs <URL> [--mobile|--desktop]
 */
const fs = require("fs");
const path = require("path");
const lighthouseModule = require("lighthouse");

// Support both default and named exports depending on the installed version
const lighthouse = lighthouseModule.default || lighthouseModule;
const chromeLauncher = require("chrome-launcher");

// Main runner — launches Chrome, runs Lighthouse, and saves reports
const run = async (url, opts = {}) => {
	// Launch headless Chromium with flags suitable for CI and containerised environments
	const chrome = await chromeLauncher.launch({
		chromeFlags: [
			"--headless=new",
			"--no-sandbox",
			"--disable-gpu",
			"--disable-dev-shm-usage",
			"--ignore-certificate-errors",
			"--allow-insecure-localhost",
			"--disable-features=IsolateOrigins,site-per-process",
		],
	});

	// Build Lighthouse options — default to desktop form factor if not specified
	const options = {
		port: chrome.port,
		output: "html",
		onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
		emulatedFormFactor: opts.formFactor || "desktop",
	};

	console.log(
		`Running Lighthouse on ${url} (${options.emulatedFormFactor})...`,
	);

	// Execute the Lighthouse audit and extract HTML + JSON reports
	const runnerResult = await lighthouse(url, options);
	const reportHtml = runnerResult.report;
	const reportJson = runnerResult.lhr;

	// Ensure the output directory exists before writing reports
	const outDir = path.resolve(__dirname, "..", "lighthouse");
	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

	// Generate timestamped filenames so reports don't overwrite each other
	const ts = new Date().toISOString().replace(/[:.]/g, "-");
	const htmlPath = path.join(
		outDir,
		`lighthouse-${options.emulatedFormFactor}-${ts}.html`,
	);
	const jsonPath = path.join(
		outDir,
		`lighthouse-${options.emulatedFormFactor}-${ts}.json`,
	);

	// Write both the human-readable HTML report and the machine-readable JSON
	fs.writeFileSync(htmlPath, reportHtml);
	fs.writeFileSync(jsonPath, JSON.stringify(reportJson, null, 2));

	// Print report paths and a compact category score summary
	console.log(`Saved reports: ${htmlPath} and ${jsonPath}`);
	console.log("----- Scores -----");
	console.log(
		JSON.stringify(
			Object.fromEntries(
				Object.entries(reportJson.categories).map(([k, v]) => [
					k,
					Math.round(v.score * 100),
				]),
			),
			null,
			2,
		),
	);

	await chrome.kill();
};

// Parse CLI arguments — require exactly one URL; form factor defaults to desktop
const args = process.argv.slice(2);
if (args.length < 1) {
	console.error(
		"Usage: node scripts/lighthouse-run.cjs <URL> [--mobile|--desktop]",
	);
	process.exit(1);
}
const url = args[0];
const formFactor = args.includes("--mobile") ? "mobile" : "desktop";

// Execute the runner and handle any unexpected errors
run(url, { formFactor }).catch((err) => {
	console.error(err);
	process.exit(1);
});

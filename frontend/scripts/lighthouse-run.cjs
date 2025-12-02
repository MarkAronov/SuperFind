#!/usr/bin/env node
/* CommonJS version for environments with "type": "module"
   Runs Lighthouse in headless Chrome using chrome-launcher
*/
const fs = require("fs");
const path = require("path");
const lighthouseModule = require("lighthouse");
const lighthouse = lighthouseModule.default || lighthouseModule;
const chromeLauncher = require("chrome-launcher");

async function run(url, opts = {}) {
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
	const options = {
		port: chrome.port,
		output: "html",
		onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
		emulatedFormFactor: opts.formFactor || "desktop",
	};
	console.log(
		`Running Lighthouse on ${url} (${options.emulatedFormFactor})...`,
	);
	const runnerResult = await lighthouse(url, options);
	const reportHtml = runnerResult.report;
	const reportJson = runnerResult.lhr;

	const outDir = path.resolve(__dirname, "..", "lighthouse");
	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
	const ts = new Date().toISOString().replace(/[:.]/g, "-");
	const htmlPath = path.join(
		outDir,
		`lighthouse-${options.emulatedFormFactor}-${ts}.html`,
	);
	const jsonPath = path.join(
		outDir,
		`lighthouse-${options.emulatedFormFactor}-${ts}.json`,
	);
	fs.writeFileSync(htmlPath, reportHtml);
	fs.writeFileSync(jsonPath, JSON.stringify(reportJson, null, 2));

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
}

const args = process.argv.slice(2);
if (args.length < 1) {
	console.error(
		"Usage: node scripts/lighthouse-run.cjs <URL> [--mobile|--desktop]",
	);
	process.exit(1);
}
const url = args[0];
const formFactor = args.includes("--mobile") ? "mobile" : "desktop";
run(url, { formFactor }).catch((err) => {
	console.error(err);
	process.exit(1);
});

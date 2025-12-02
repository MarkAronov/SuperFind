#!/usr/bin/env node
/**
 * CommonJS Axe + Puppeteer runner to support Node with type: module
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const axeSource = require("axe-core").source;

async function run(url) {
	const browser = await puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "networkidle0" });
	// Inject axe
	await page.evaluate(axeSource);
	// Run axe with default options
	const result = await page.evaluate(async () => await window.axe.run());

	const outDir = path.resolve(__dirname, "..", "lighthouse");
	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
	const ts = new Date().toISOString().replace(/[:.]/g, "-");
	const jsonPath = path.join(outDir, `axe-${ts}.json`);
	fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
	await browser.close();
	console.log("Axe report saved to", jsonPath);
	console.log("Violations:", result.violations.length);
	if (result.violations.length > 0) {
		result.violations.forEach((v) => {
			console.log("\n", v.id, "-", v.impact, "-", v.help);
			v.nodes.forEach((n) => console.log("  - ", n.target.join(", ")));
		});
		process.exit(2);
	}
}

const args = process.argv.slice(2);
if (args.length < 1) {
	console.error("Usage: node scripts/axe-run.cjs <URL>");
	process.exit(1);
}
run(args[0]).catch((err) => {
	console.error(err);
	process.exit(1);
});

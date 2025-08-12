import { Hono } from "hono";
import { parseAndSaveCSV } from "./csv-parser.services";

// Entry point for CSV parser module

const csvParserApp = new Hono();

csvParserApp.post("/upload-csv", async (c) => {
	const formData = await c.req.formData();
	const file = formData.get("file") as File;

	if (!file) {
		return c.json({ error: "No file uploaded" }, 400);
	}

	const csvContent = await file.text();
	const outputFilePath = parseAndSaveCSV(csvContent);

	return c.json({
		message: "CSV parsed and saved successfully!",
		outputPath: outputFilePath,
	});
});

export default csvParserApp;

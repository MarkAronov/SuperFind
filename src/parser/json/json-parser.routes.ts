import { Hono } from "hono";
import { saveJsonFile } from "./json-parser.services";

const jsonParserApp = new Hono();

jsonParserApp.post("/upload-json", async (c) => {
	const formData = await c.req.formData();
	const file = formData.get("file") as File;
	if (!file) return c.json({ error: "No file uploaded" }, 400);

	const content = await file.text();
	const outputPath = saveJsonFile(content);

	return c.json({ message: "JSON saved", outputPath });
});

export default jsonParserApp;

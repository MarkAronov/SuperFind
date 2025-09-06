import { Hono } from "hono";
import { saveTextFile } from "./text-parser.services";

const textParserApp = new Hono();

textParserApp.post("/upload-txt", async (c) => {
	const formData = await c.req.formData();
	const file = formData.get("file") as File;
	if (!file) return c.json({ error: "No file uploaded" }, 400);

	const content = await file.text();
	const outputPath = saveTextFile(
		content,
		file.name || `output-${Date.now()}.txt`,
	);

	return c.json({ message: "Text saved", outputPath });
});

export default textParserApp;

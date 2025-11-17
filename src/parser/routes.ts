import { Hono } from "hono";
import { log } from "../utils/logger";
import { getDataStoreStats, processFileUpload } from "./";

/**
 * Consolidated parser routes - single upload endpoint for all file types
 */
const parserApp = new Hono();

// Single upload endpoint that handles CSV, JSON, and Text files
parserApp.post("/upload", async (c) => {
	try {
		const formData = await c.req.formData();
		const file = formData.get("file") as File;
		const fileType = c.req.query("type") as "csv" | "json" | "text";

		// Validate basic inputs
		if (!file) {
			return c.json({ error: "No file uploaded" }, 400);
		}

		if (!fileType || !["csv", "json", "text"].includes(fileType)) {
			return c.json(
				{
					error:
						"Invalid or missing file type. Use ?type=csv, ?type=json, or ?type=text",
				},
				400,
			);
		}

		// Delegate all processing and validation to the service
		const result = await processFileUpload(file, fileType);

		if (result.success) {
			return c.json({
				success: true,
				message: result.message,
				data: result.data,
			});
		} else {
			return c.json(
				{
					success: false,
					error: result.error,
					message: result.message,
				},
				400,
			);
		}
	} catch (error) {
		log("PARSER_UPLOAD_ERROR", { error: String(error) });
		return c.json(
			{
				success: false,
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			500,
		);
	}
});

export default parserApp;

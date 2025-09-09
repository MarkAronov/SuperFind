import { Hono } from "hono";
import aiRouter from "./ai/ai-routes";
import { initialize } from "./init/init.service";
import csvParserApp from "./parser/csv/csv-parser.routes";
import jsonParserApp from "./parser/json/json-parser.routes";
import textParserApp from "./parser/text/text-parser.routes";

const app = new Hono();

// Initialize the system on startup
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

const runInitialization = async (): Promise<void> => {
	if (isInitialized || initializationPromise) {
		return initializationPromise || Promise.resolve();
	}

	initializationPromise = (async () => {
		try {
			console.log("🔧 Running startup initialization...");
			await initialize();
			isInitialized = true;
			console.log("✅ Startup initialization completed successfully");
		} catch (error) {
			console.error("❌ Startup initialization failed:", error);
			// Don't prevent the server from starting, but log the error
		}
	})();

	return initializationPromise;
};

// Run initialization immediately
runInitialization();

app.get("/", (c) => {
	return c.json({
		message: "SuperFind API",
		status: "running",
		version: "1.0.0",
		initialized: isInitialized,
	});
});

app.route("/csv", csvParserApp);
app.route("/json", jsonParserApp);
app.route("/text", textParserApp);
app.route("/ai", aiRouter);

export default app;

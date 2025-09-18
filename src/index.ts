import { Hono } from "hono";
import aiRouter from "./ai/ai.routes";
import { initializeAIService } from "./ai/ai.services";
import { createBestAvailable } from "./ai/providers/provider-factory";
import parserApp from "./parser/parser.routes";
import {
	processFiles,
	scanStaticDataFolder,
	storeProcessedData,
} from "./parser/parser.services";
import { checkApplicationHealth } from "./services/health.services";
import { initQdrant } from "./vector/qdrant.services";

interface ProcessedFile {
	fileName: string;
	filePath: string;
	dataType: "csv" | "json" | "text";
	md5Hash: string;
	alreadyExists: boolean;
	storedInQdrant: boolean;
	processedData?: object;
}

/**
 * Initialize external services (Qdrant, databases, etc.)
 */
async function initializeExternalServices(): Promise<void> {
	console.log("🔌 Initializing external services...");

	// Initialize Qdrant vector database
	const qdrantResult = await initQdrant();
	if (qdrantResult.success) {
		console.log("✅ Qdrant initialized successfully");
	} else {
		console.warn(`⚠️ Qdrant initialization failed: ${qdrantResult.error}`);
	}
}

/**
 * Load and process static data files
 */
async function loadStaticData(): Promise<ProcessedFile[]> {
	console.log("📁 Loading static data files...");

	// Scan for files in static-data folder
	const files = await scanStaticDataFolder();
	console.log(`🔍 Found ${files} files to process`);
	// Process all files
	const processedFiles = await processFiles(files);

	// Log results
	for (const file of processedFiles) {
		if (file.alreadyExists) {
			console.log(`↩️ Skipped (already exists): ${file.fileName}`);
		} else {
			console.log(`✅ Processed: ${file.fileName}`);
		}
	}

	return processedFiles;
}

/**
 * Main application initialization function
 */
async function initializeApplication(): Promise<ProcessedFile[]> {
	try {
		console.log("🚀 Starting application initialization...");

		// 1. Initialize external dependencies
		await initializeExternalServices();

		// 2. Load and process static data
		const processedFiles = await loadStaticData();

		console.log(
			`✅ Application initialization complete! Processed ${processedFiles.length} files`,
		);

		return processedFiles;
	} catch (error) {
		console.error("❌ Application initialization failed:", error);
		throw error;
	}
}

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
			console.log("🚀 Running startup initialization...");

			// Step 1: Initialize AI Service
			console.log("🤖 Initializing AI service...");
			const aiProvider = await createBestAvailable();
			initializeAIService(aiProvider);
			console.log(`✅ AI service initialized with ${aiProvider.name}`);

			// Step 2: Initialize application (data processing, external services)
			console.log("📊 Initializing application...");
			const processedFiles = await initializeApplication();

			// Step 3: Store processed data
			storeProcessedData(processedFiles);
			console.log(`✅ Stored ${processedFiles.length} processed files`);

			isInitialized = true;
			console.log("🎉 Startup initialization completed successfully");
		} catch (error) {
			console.error("❌ Startup initialization failed:", error);
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

// Health check endpoint
app.get("/health", async (c) => {
	const health = await checkApplicationHealth();
	return c.json({
		...health,
		initialized: isInitialized,
		timestamp: new Date().toISOString(),
	});
});

app.route("/parser", parserApp);
app.route("/ai", aiRouter);

export default app;

import { Hono } from "hono";
import aiRouter from "./ai/ai.routes";
import { initializeAIService } from "./ai/ai.services";
import { createBestAvailable } from "./ai/providers/provider-factory";
import {
	logCurrentConfiguration,
	validateEnvironment,
} from "./config/env.config";
import parserApp from "./parser/parser.routes";
import {
	processFiles,
	scanStaticDataFolder,
	storeProcessedData,
} from "./parser/parser.services";
import { checkApplicationHealth } from "./services/health.services";
import {
	createLangChainVectorStore,
	initQdrant,
} from "./vector/qdrant.services";

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
	console.log("\n[3] Initializing external services...");

	// Initialize Qdrant vector database
	const qdrantResult = await initQdrant();
	if (qdrantResult.success) {
		console.log("    ✓ Qdrant initialized successfully");
	} else {
		console.warn(`    ⚠ Qdrant initialization failed: ${qdrantResult.error}`);
	}
}

/**
 * Load and process static data files
 */
async function loadStaticData(): Promise<ProcessedFile[]> {
	console.log("\n[4] Loading static data files...");

	// Scan for files in static-data folder
	const files = await scanStaticDataFolder();
	console.log(`    → Found ${files.length} files to process`);

	// Process all files
	const processedFiles = await processFiles(files);

	// Log results
	for (const file of processedFiles) {
		if (file.alreadyExists) {
			console.log(`    ⚬ Already exists: ${file.fileName}`);
		} else {
			console.log(`    ✓ Processed: ${file.fileName}`);
		}
	}

	return processedFiles;
}

/**
 * Main application initialization function
 */
async function initializeApplication(): Promise<ProcessedFile[]> {
	try {
		console.log("\n[3] Loading and processing static data...");

		// Load and process static data
		const processedFiles = await loadStaticData();

		console.log(
			`\n    ✓ Data processing complete! Processed ${processedFiles.length} files`,
		);

		return processedFiles;
	} catch (error) {
		console.error("\n    ✗ Data processing failed:", error);
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
			console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
			console.log("🚀 SuperFind - Starting initialization...");
			console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

			// Step 0: Log current configuration
			logCurrentConfiguration();
			const envValidation = validateEnvironment();
			if (!envValidation.valid) {
				console.error("\n❌ Environment validation failed:");
				envValidation.errors.forEach((error) =>
					console.error(`    ✗ ${error}`),
				);
				throw new Error("Environment configuration invalid");
			}

			// Step 1: Initialize external services first (Qdrant, etc.)
			await initializeExternalServices();

			// Step 2: Initialize AI Service (now that Qdrant is ready)
			console.log("\n[1] Initializing AI service...");
			const aiProvider = await createBestAvailable();
			const aiVectorStore = await createLangChainVectorStore();
			initializeAIService(aiProvider, aiVectorStore);
			console.log(`    ✓ AI service initialized with ${aiProvider.name}`);

			// Step 3: Initialize application (data processing)
			const processedFiles = await initializeApplication();

			// Step 4: Store processed data
			console.log("\n[4] Storing processed data...");
			storeProcessedData(processedFiles);

			isInitialized = true;
			console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
			console.log("✅ SuperFind initialization completed successfully!");
			console.log(
				`🌐 Server running at: http://localhost:${process.env.PORT || 3000}`,
			);
			console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		} catch (error) {
			console.error(
				"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
			);
			console.error("❌ SuperFind initialization failed!");
			console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
			console.error(error);
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

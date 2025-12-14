import { Hono } from "hono";
import { cors } from "hono/cors";
import { initializeAIService } from "./ai";
import { createBestAvailable } from "./ai/providers/provider-factory";
import aiRouter from "./ai/routes";
import {
	logCurrentConfiguration,
	validateEnvironment,
} from "./config/env.config";
import { createLangChainVectorStore, initQdrant } from "./database";
import {
	processFiles,
	scanStaticDataFolder,
	storeProcessedData,
} from "./parser";
import parserApp from "./parser/routes";
import type { ProcessedFile } from "./parser/types";
import { checkApplicationHealth } from "./services/health";
import { log, separator } from "./utils/logger";

/**
 * Initialize external services (Qdrant, databases, etc.)
 */
const initializeExternalServices = async (): Promise<void> => {
	log("STEP_INIT_SERVICES");

	// Initialize Qdrant vector database
	const qdrantResult = await initQdrant();
	if (qdrantResult.success) {
		log("DB_INIT_SUCCESS", {}, 1);
	} else {
		log("DB_INIT_FAILED", { error: qdrantResult.error || "Unknown error" }, 1);
	}
};

/**
 * Load and process static data files
 */
const loadStaticData = async (): Promise<ProcessedFile[]> => {
	log("STEP_LOAD_DATA");

	// Scan for files in static-data folder
	const files = await scanStaticDataFolder();
	log("PARSER_FILES_FOUND", { count: files.length.toString() }, 1);

	// Process all files
	const processedFiles = await processFiles(files);

	// Log results
	for (const file of processedFiles) {
		if (file.alreadyExists) {
			log("PARSER_FILE_EXISTS", { fileName: file.fileName }, 1);
		} else {
			log("PARSER_FILE_PROCESSED", { fileName: file.fileName }, 1);
		}
	}

	return processedFiles;
};

/**
 * Main application initialization function
 */
const initializeApplication = async (): Promise<ProcessedFile[]> => {
	try {
		// Check if we should skip static data loading
		if (process.env.SKIP_STATIC_DATA === "true") {
			log("STEP_SKIP_DATA");
			return [];
		}

		log("STEP_PROCESS_DATA");

		// Load and process static data
		const processedFiles = await loadStaticData();

		log(
			"DATA_PROCESSING_COMPLETE",
			{ count: processedFiles.length.toString() },
			1,
		);

		return processedFiles;
	} catch (error) {
		log("DATA_PROCESSING_FAILED", { error: String(error) });
		throw error;
	}
};

const app = new Hono();

// Enable CORS for frontend (development and production)
const allowedOrigins = [
	"http://localhost:5173", // Local development
	"http://localhost:3000", // Local backend
];

// Add production frontend URL if in production
if (process.env.NODE_ENV === "production" && process.env.FRONTEND_URL) {
	allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
	"/*",
	cors({
		origin: (origin) => {
			// Allow requests with no origin (like mobile apps or curl)
			if (!origin) return "*";
			// Check if origin is in allowed list
			if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
				return origin;
			}
			// Allow any vercel.app domain in production
			if (
				process.env.NODE_ENV === "production" &&
				origin.includes(".vercel.app")
			) {
				return origin;
			}
			return allowedOrigins[0];
		},
		credentials: true,
	}),
);

// Initialize the system on startup
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

const runInitialization = async (): Promise<void> => {
	if (isInitialized || initializationPromise) {
		return initializationPromise || Promise.resolve();
	}

	initializationPromise = (async () => {
		try {
			separator();
			log("APP_START");
			separator();

			// Step 0: Log current configuration
			logCurrentConfiguration();
			const envValidation = validateEnvironment();
			if (!envValidation.valid) {
				log("CONFIG_VALIDATION_FAILED");
				envValidation.errors.forEach((error) => {
					log("CONFIG_ERROR", { error }, 1);
				});
				throw new Error("Environment configuration invalid");
			}

			// Step 1: Initialize external services first (Qdrant, etc.)
			await initializeExternalServices();

			// Step 2: Initialize AI Service (now that Qdrant is ready)
			log("STEP_INIT_AI");
			const aiProvider = await createBestAvailable();
			const aiVectorStore = await createLangChainVectorStore();
			initializeAIService(aiProvider, aiVectorStore);
			log("AI_PROVIDER_INITIALIZED", { provider: aiProvider.name }, 1);

			// Step 3: Initialize application (data processing)
			const processedFiles = await initializeApplication();

			// Step 4: Store processed data
			log("STEP_STORE_DATA");
			storeProcessedData(processedFiles);

			isInitialized = true;
			separator();
			log("APP_READY");

			// Determine the actual server URL based on environment
			const port = process.env.PORT || 3000;
			const serverUrl = process.env.RENDER_EXTERNAL_URL
				? process.env.RENDER_EXTERNAL_URL
				: process.env.NODE_ENV === "production" && process.env.BACKEND_URL
					? process.env.BACKEND_URL
					: `http://localhost:${port}`;

			log("SERVER_URL", { url: serverUrl }, 1);
			separator();
		} catch (error) {
			separator();
			log("APP_START_FAILED");
			separator();
			// Log raw error for debugging (outside logger system for critical failures)
			if (error instanceof Error) {
				console.error(`Error: ${error.message}`);
				console.error(error.stack);
			} else {
				console.error(error);
			}
		}
	})();

	return initializationPromise;
};

// Run initialization immediately
runInitialization();

app.get("/", (c) => {
	return c.json({
		message: "SkillVector API",
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

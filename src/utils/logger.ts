/**
 * Centralized logging utility with consistent formatting and message types
 */

export type LogLevel = "info" | "success" | "warning" | "error" | "debug";
export type LogCategory =
	| "INIT"
	| "AI"
	| "DATABASE"
	| "PARSER"
	| "CONFIG"
	| "HEALTH"
	| "PROVIDER";

interface LogMessage {
	level: LogLevel;
	category: LogCategory;
	icon: string;
	template: string;
}

/**
 * Predefined log message templates
 */
const LOG_MESSAGES: Record<string, LogMessage> = {
	// Initialization messages
	APP_START: {
		level: "info",
		category: "INIT",
		icon: "🚀",
		template: "SkillVector - Starting initialization...",
	},
	APP_SUCCESS: {
		level: "success",
		category: "INIT",
		icon: "✅",
		template: "SkillVector initialization completed successfully!",
	},
	APP_FAILED: {
		level: "error",
		category: "INIT",
		icon: "❌",
		template: "SkillVector initialization failed!",
	},
	STEP_INIT_AI: {
		level: "info",
		category: "INIT",
		icon: "🤖",
		template: "[1] Initializing AI service...",
	},
	STEP_INIT_SERVICES: {
		level: "info",
		category: "INIT",
		icon: "⚙️",
		template: "[3] Initializing external services...",
	},
	STEP_LOAD_DATA: {
		level: "info",
		category: "INIT",
		icon: "📂",
		template: "[4] Loading static data files...",
	},
	STEP_STORE_DATA: {
		level: "info",
		category: "INIT",
		icon: "💾",
		template: "[4] Storing processed data...",
	},
	ENV_VALIDATION_FAILED: {
		level: "error",
		category: "CONFIG",
		icon: "❌",
		template: "Environment validation failed:",
	},

	// AI messages
	AI_INITIALIZED: {
		level: "success",
		category: "AI",
		icon: "✓",
		template: "AI service initialized with {provider}",
	},
	AI_SEARCH_REQUEST: {
		level: "debug",
		category: "AI",
		icon: "→",
		template: "AI Search request: {query}",
	},
	AI_SEARCH_SUCCESS: {
		level: "success",
		category: "AI",
		icon: "✓",
		template: "Found {count} relevant results",
	},
	AI_SEARCH_ERROR: {
		level: "error",
		category: "AI",
		icon: "✗",
		template: "AI search error:",
	},
	AI_FILTERING_ERROR: {
		level: "warning",
		category: "AI",
		icon: "⚠",
		template: "AI filtering error:",
	},
	AI_CANDIDATES_RETRIEVED: {
		level: "debug",
		category: "AI",
		icon: "→",
		template: "Retrieved {count} candidates",
	},
	AI_TEXT_EXTRACTION_ERROR: {
		level: "error",
		category: "AI",
		icon: "✗",
		template: "AI text extraction error:",
	},

	// Database messages
	DB_CONNECTED: {
		level: "success",
		category: "DATABASE",
		icon: "✓",
		template: "Connected to Qdrant at {host}:{port}",
	},
	DB_INIT_SUCCESS: {
		level: "success",
		category: "DATABASE",
		icon: "✓",
		template: "Qdrant initialized successfully",
	},
	DB_INIT_FAILED: {
		level: "warning",
		category: "DATABASE",
		icon: "⚠",
		template: "Qdrant initialization failed: {error}",
	},
	DB_VECTOR_STORE_CREATED: {
		level: "success",
		category: "DATABASE",
		icon: "✓",
		template: "LangChain Qdrant vector store created successfully",
	},
	DB_VECTOR_STORE_FAILED: {
		level: "error",
		category: "DATABASE",
		icon: "✗",
		template: "Failed to create LangChain vector store:",
	},
	DB_FALLBACK_MODE: {
		level: "warning",
		category: "DATABASE",
		icon: "⚠",
		template: "Using fallback mock vector store",
	},

	// Parser messages
	PARSER_FILES_FOUND: {
		level: "info",
		category: "PARSER",
		icon: "→",
		template: "Found {count} files to process",
	},
	PARSER_FILE_EXISTS: {
		level: "debug",
		category: "PARSER",
		icon: "⚬",
		template: "Already exists: {fileName}",
	},
	PARSER_FILE_PROCESSED: {
		level: "success",
		category: "PARSER",
		icon: "✓",
		template: "Processed: {fileName}",
	},
	PARSER_PERSON_STORED: {
		level: "success",
		category: "PARSER",
		icon: "→",
		template: "Stored person: {name}",
	},
	PARSER_PERSON_FAILED: {
		level: "error",
		category: "PARSER",
		icon: "✗",
		template: "Failed to store person: {name} - {error}",
	},
	PARSER_PERSON_SKIPPED: {
		level: "warning",
		category: "PARSER",
		icon: "⚠",
		template: "Skipping {name}: missing required fields: {fields}",
	},
	PARSER_DUPLICATE_SKIPPED: {
		level: "debug",
		category: "PARSER",
		icon: "⚬",
		template: "Skipping duplicate beyond cap (>{maxDupes}): {name}",
	},
	PARSER_DUPLICATE_EXISTS: {
		level: "debug",
		category: "PARSER",
		icon: "⚬",
		template: "Person {name} already exists (MD5: {md5})",
	},
	PARSER_DOCUMENT_EXISTS: {
		level: "debug",
		category: "PARSER",
		icon: "⚬",
		template: "Document {fileName} already exists (MD5: {md5})",
	},
	PARSER_NO_ENTITIES: {
		level: "error",
		category: "PARSER",
		icon: "✗",
		template: "No entities extracted from {fileName}",
	},
	PARSER_FILE_ERROR: {
		level: "error",
		category: "PARSER",
		icon: "✗",
		template: "Error processing file {fileName}:",
	},
	PARSER_ENTITIES_STORED: {
		level: "success",
		category: "PARSER",
		icon: "✓",
		template:
			"Processed and stored {count} entities from {fileName} (MD5: {md5})",
	},
	PARSER_DATA_STORED: {
		level: "success",
		category: "PARSER",
		icon: "✓",
		template: "Stored {count} processed files in data store",
	},
	PARSER_RUN_SUMMARY: {
		level: "info",
		category: "PARSER",
		icon: "⏺",
		template:
			"Run summary: processed {filesCount} files, duplicates encountered: {dupes}, bad entries encountered: {bads} (caps dupes<={maxDupes}, bads<={maxBads})",
	},
	PARSER_SCAN_ERROR: {
		level: "error",
		category: "PARSER",
		icon: "✗",
		template: "Error scanning static data folder:",
	},
	PARSER_DIR_ERROR: {
		level: "error",
		category: "PARSER",
		icon: "✗",
		template: "Error reading directory {dirPath}:",
	},
	PARSER_CSV_PARSED: {
		level: "debug",
		category: "PARSER",
		icon: "→",
		template: "Parsed CSV data: {data}",
	},
	PARSER_JSON_PARSED: {
		level: "debug",
		category: "PARSER",
		icon: "→",
		template: "Parsed JSON data:",
	},
	PARSER_JSON_ERROR: {
		level: "error",
		category: "PARSER",
		icon: "✗",
		template: "JSON parsing error:",
	},
	PARSER_UNKNOWN_TYPE: {
		level: "warning",
		category: "PARSER",
		icon: "⚠",
		template: "Unknown file type: {type}",
	},
	PARSER_UPLOAD_ERROR: {
		level: "error",
		category: "PARSER",
		icon: "✗",
		template: "Upload error:",
	},
	PARSER_DATA_PROCESSING_FAILED: {
		level: "error",
		category: "PARSER",
		icon: "✗",
		template: "Data processing failed:",
	},
	PARSER_CHECK_EXISTS_WARN: {
		level: "warning",
		category: "PARSER",
		icon: "⚠",
		template:
			"Could not check document existence: {error}. Proceeding with processing...",
	},

	// Provider messages
	PROVIDER_OPENAI_UNAVAILABLE: {
		level: "debug",
		category: "PROVIDER",
		icon: "→",
		template: "OpenAI not available, trying Anthropic...",
	},
	PROVIDER_ANTHROPIC_SELECTED: {
		level: "success",
		category: "PROVIDER",
		icon: "✓",
		template: "Using Anthropic Claude",
	},
	PROVIDER_ANTHROPIC_UNAVAILABLE: {
		level: "debug",
		category: "PROVIDER",
		icon: "→",
		template: "Anthropic not available, trying Gemini...",
	},
	PROVIDER_GEMINI_SELECTED: {
		level: "success",
		category: "PROVIDER",
		icon: "✓",
		template: "Using Google Gemini",
	},
	PROVIDER_GEMINI_UNAVAILABLE: {
		level: "debug",
		category: "PROVIDER",
		icon: "→",
		template: "Gemini not available, trying Hugging Face...",
	},
	PROVIDER_HUGGINGFACE_SELECTED: {
		level: "success",
		category: "PROVIDER",
		icon: "✓",
		template: "Using Hugging Face",
	},
	PROVIDER_HUGGINGFACE_UNAVAILABLE: {
		level: "debug",
		category: "PROVIDER",
		icon: "→",
		template: "Hugging Face not available, trying Ollama...",
	},
	PROVIDER_OLLAMA_SELECTED: {
		level: "success",
		category: "PROVIDER",
		icon: "✓",
		template: "Using Ollama with model: {model}",
	},
	PROVIDER_OLLAMA_FETCH_ERROR: {
		level: "warning",
		category: "PROVIDER",
		icon: "⚠",
		template: "Could not fetch Ollama models:",
	},

	// Validation messages
	VALIDATION_JSON_FAILED: {
		level: "warning",
		category: "PARSER",
		icon: "⚠",
		template: "JSON parsing/validation failed:",
	},
	VALIDATION_SCHEMA_ERRORS: {
		level: "warning",
		category: "PARSER",
		icon: "⚠",
		template: "Schema validation errors:",
	},
};

/**
 * Format a template string with provided variables
 */
const formatTemplate = (
	template: string,
	vars: Record<string, unknown> = {},
): string => {
	return template.replace(/\{(\w+)\}/g, (_, key) => {
		const value = vars[key];
		return value !== undefined ? String(value) : `{${key}}`;
	});
};

/**
 * Add indentation to a message
 */
const indent = (message: string, level: number = 1): string => {
	const spaces = "    ".repeat(level);
	return `${spaces}${message}`;
};

/**
 * Create a separator line
 */
export const separator = (char = "━", length = 59): string => {
	return char.repeat(length);
};

/**
 * Log a predefined message
 */
export const log = (
	messageKey: string,
	vars: Record<string, unknown> = {},
	indentLevel: number = 0,
): void => {
	const message = LOG_MESSAGES[messageKey];

	if (!message) {
		console.warn(`Unknown log message key: ${messageKey}`);
		return;
	}

	const formattedMessage = formatTemplate(message.template, vars);
	const fullMessage =
		indentLevel > 0
			? indent(`${message.icon} ${formattedMessage}`, indentLevel)
			: `${message.icon} ${formattedMessage}`;

	switch (message.level) {
		case "error":
			console.error(fullMessage);
			break;
		case "warning":
			console.warn(fullMessage);
			break;
		default:
			console.log(fullMessage);
	}
};

/**
 * Log raw data/objects (for debugging)
 */
export const logData = (data: unknown, indentLevel: number = 0): void => {
	const output = indentLevel > 0 ? indent(String(data), indentLevel) : data;
	console.log(output);
};

/**
 * Log with custom formatting
 */
export const logCustom = (
	message: string,
	level: LogLevel = "info",
	icon: string = "",
	indentLevel: number = 0,
): void => {
	const fullMessage =
		indentLevel > 0
			? indent(`${icon} ${message}`.trim(), indentLevel)
			: `${icon} ${message}`.trim();

	switch (level) {
		case "error":
			console.error(fullMessage);
			break;
		case "warning":
			console.warn(fullMessage);
			break;
		default:
			console.log(fullMessage);
	}
};

/**
 * Log a section header
 */
export const logSection = (title: string): void => {
	console.log(`\n${separator()}`);
	console.log(title);
	console.log(separator());
};

/**
 * Log a subsection
 */
export const logSubsection = (title: string): void => {
	console.log(`\n${title}`);
};

/**
 * Export message keys for type safety
 */
export const LogKeys = Object.keys(LOG_MESSAGES) as Array<
	keyof typeof LOG_MESSAGES
>;

/**
 * Type-safe message key type
 */
export type LogMessageKey = keyof typeof LOG_MESSAGES;

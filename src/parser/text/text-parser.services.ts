import { convertTextToJson } from "../../ai/ai-service.js";
import { saveFile } from "../../utils/save-file.js";

export const saveTextFile = (
	textContent: string,
	filename?: string,
): string => {
	const baseName = filename ? filename.replace(/\.[^/.]+$/, "") : "output";
	const outputPath = `./static-data/text/${baseName}.txt`;
	saveFile("./static-data/text", outputPath, textContent);
	return outputPath;
};

/**
 * Convert text to JSON using dynamic AI service with interface-driven keys
 * @param textContent - Raw text content to parse
 * @param targetInterface - TypeScript interface string defining the expected JSON structure
 * @param extractionHint - Optional hint about what data to extract (e.g., "people", "contacts")
 */
export const convertTextToJSON = async (
	textContent: string,
	targetInterface: string,
	extractionHint?: string,
): Promise<object> => {
	try {
		// Use the AI service to convert text to JSON
		const result = await convertTextToJson(
			textContent,
			targetInterface,
			extractionHint,
		);

		if (result.success && result.data) {
			return result.data;
		} else {
			throw new Error(result.error || "AI conversion failed");
		}
	} catch (error) {
		console.error("AI text extraction error:", error);

		// Fallback: create empty object with expected keys
		const interfaceKeys = extractKeysFromInterface(targetInterface);
		const fallback: Record<string, string> = {};
		for (const key of interfaceKeys) {
			fallback[key] = "";
		}
		return fallback;
	}
};

/**
 * Extract property keys from TypeScript interface string
 * e.g., "interface Person { name: string; email: string; }" -> ["name", "email"]
 */
const extractKeysFromInterface = (interfaceString: string): string[] => {
	const propertyRegex = /(\w+)(?:\?)?\s*:/g;
	const keys: string[] = [];
	let match: RegExpExecArray | null;

	while (true) {
		match = propertyRegex.exec(interfaceString);
		if (match === null) break;
		keys.push(match[1]);
	}

	return keys;
};

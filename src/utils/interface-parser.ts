/**
 * Shared interface parsing utilities
 * Used by both AI and Parser services for extracting and validating interface structures
 */

import { z } from "zod";

/**
 * Extract property keys from TypeScript interface string
 * e.g., "interface Person { name: string; email: string; }" -> ["name", "email"]
 */
export const extractKeysFromInterface = (interfaceString: string): string[] => {
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

/**
 * Create a dynamic Zod schema from interface keys
 * All fields are optional strings with default empty string
 */
export const createZodSchemaFromKeys = (keys: string[]) => {
	const schemaObject: Record<string, z.ZodTypeAny> = {};
	for (const key of keys) {
		schemaObject[key] = z.string().optional().default("");
	}
	return z.object(schemaObject);
};

/**
 * Parse and validate JSON response from AI with detailed error handling
 */
export const parseAndValidateJson = (
	response: string,
	schema: z.ZodSchema,
	expectedKeys: string[],
): Record<string, unknown> => {
	try {
		// Clean the response - remove markdown code blocks if present
		let cleanedResponse = response.trim();
		cleanedResponse = cleanedResponse.replace(/^```json\s*/i, "");
		cleanedResponse = cleanedResponse.replace(/^```\s*/i, "");
		cleanedResponse = cleanedResponse.replace(/\s*```$/i, "");
		cleanedResponse = cleanedResponse.trim();

		// Try to extract JSON from response - support both object and array
		const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			throw new Error(
				`No JSON object found in response. Response preview: ${cleanedResponse.substring(0, 100)}...`,
			);
		}

		// Parse JSON
		let parsed: unknown;
		try {
			parsed = JSON.parse(jsonMatch[0]);
		} catch (parseError) {
			throw new Error(
				`JSON syntax error: ${parseError instanceof Error ? parseError.message : "Invalid JSON"}. Content: ${jsonMatch[0].substring(0, 100)}...`,
			);
		}

		// Validate using Zod schema
		const validated = schema.parse(parsed) as Record<string, unknown>;

		// Ensure all expected keys exist
		const result: Record<string, unknown> = {};
		for (const key of expectedKeys) {
			result[key] = validated[key] || "";
		}

		return result;
	} catch (error) {
		console.warn("        ⚠ JSON parsing/validation failed:");
		if (error instanceof z.ZodError) {
			console.warn("          Schema validation errors:");
			for (const issue of error.issues) {
				console.warn(`          - ${issue.path.join(".")}: ${issue.message}`);
			}
		} else {
			console.warn(
				`          ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
		console.warn(
			"          Using fallback data with empty values for all keys",
		);

		// Fallback: create empty object with expected keys
		const fallback: Record<string, unknown> = {};
		for (const key of expectedKeys) {
			fallback[key] = "";
		}
		return fallback;
	}
};

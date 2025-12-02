/**
 * File validators service - handles validation of file types and content
 * to ensure files match their declared types
 */

/**
 * Validate file extension matches declared type
 */
export const validateFileType = (
	declaredType: "csv" | "json" | "text",
	fileExtension: string | undefined,
	fileName: string,
): { isValid: boolean; message: string } => {
	if (!fileExtension) {
		return {
			isValid: false,
			message: `File "${fileName}" has no extension. Expected .${declaredType} file.`,
		};
	}

	const validExtensions: Record<string, string[]> = {
		csv: ["csv"],
		json: ["json"],
		text: ["txt", "md", "text"],
	};

	const allowedExtensions = validExtensions[declaredType];
	if (!allowedExtensions.includes(fileExtension)) {
		return {
			isValid: false,
			message: `File extension ".${fileExtension}" does not match declared type "${declaredType}". Expected: ${allowedExtensions.map((ext) => `.${ext}`).join(", ")}`,
		};
	}

	return { isValid: true, message: "File extension is valid" };
};

/**
 * Validate file content matches declared type
 */
export const validateFileContent = async (
	declaredType: "csv" | "json" | "text",
	content: string,
): Promise<{ isValid: boolean; message: string }> => {
	try {
		switch (declaredType) {
			case "csv": {
				// Check if content looks like CSV (has commas and reasonable structure)
				const lines = content.trim().split("\n");
				if (lines.length < 1) {
					return { isValid: false, message: "CSV file appears to be empty" };
				}

				// Check if first line has commas (header row)
				if (!lines[0].includes(",")) {
					return {
						isValid: false,
						message: "CSV file does not contain comma-separated values",
					};
				}

				return { isValid: true, message: "CSV content is valid" };
			}

			case "json": {
				// Try to parse as JSON
				try {
					JSON.parse(content);
					return { isValid: true, message: "JSON content is valid" };
				} catch (jsonError) {
					return {
						isValid: false,
						message: `Invalid JSON format: ${jsonError instanceof Error ? jsonError.message : "Unknown JSON error"}`,
					};
				}
			}

			case "text": {
				// Text files are generally always valid if they have content
				if (content.trim().length === 0) {
					return { isValid: false, message: "Text file appears to be empty" };
				}

				return { isValid: true, message: "Text content is valid" };
			}

			default:
				return {
					isValid: false,
					message: `Unknown file type: ${declaredType}`,
				};
		}
	} catch (error) {
		return {
			isValid: false,
			message: `Content validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
		};
	}
};

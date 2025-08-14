import { saveFile } from "../../utils";

export const saveTextFile = (
	textContent: string,
	filename?: string,
): string => {
	const baseName = filename ? filename.replace(/\.[^/.]+$/, "") : "output";
	const outputPath = saveFile("text", baseName, textContent);
	return outputPath;
};

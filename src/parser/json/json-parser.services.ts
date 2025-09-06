import { saveFile } from "../../utils";

export const saveJsonFile = (jsonContent: string): string => {
	const outputPath = saveFile("json", "output", jsonContent);
	return outputPath;
};

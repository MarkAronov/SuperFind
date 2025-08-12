import * as fs from "fs";

export const saveFile = (outputDir: string, outputFilePath: string, data: any) => {
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
		console.log(`Output directory created at: ${outputDir}`);
	} else {
		console.log(`Output directory already exists at: ${outputDir}`);
	}
	fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
	console.log(`File saved at: ${outputFilePath}`);
};

import * as fs from "fs";
import * as path from "path";

const randomId = (length = 8) => {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	let id = "";
	for (let i = 0; i < length; i++)
		id += chars[Math.floor(Math.random() * chars.length)];
	return `${Date.now().toString(36)}-${id}`;
};

export const saveFile = (
	subfolder: string,
	filenameBase: string,
	data: unknown,
): string => {
	const outputDir = path.join(process.cwd(), "src", "output", subfolder);
	if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

	const uuid = randomId();
	const filename = `${filenameBase}-${uuid}.json`;
	const filePath = path.join(outputDir, filename);
	fs.writeFileSync(
		filePath,
		typeof data === "string" ? data : JSON.stringify(data, null, 2),
	);
	console.log(`Saved file to ${filePath}`);
	return filePath;
};

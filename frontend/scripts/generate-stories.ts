import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";

interface ComponentInfo {
	name: string;
	path: string;
	category: string;
	hasProps: boolean;
	isDefaultExport: boolean;
}

const COMPONENT_DIRS = {
	atoms: "atoms",
	molecules: "molecules",
	organisms: "organisms",
	pages: "pages",
};

async function getComponentFiles(
	baseDir: string,
): Promise<Map<string, string[]>> {
	const componentsByCategory = new Map<string, string[]>();

	for (const [category, dirName] of Object.entries(COMPONENT_DIRS)) {
		const categoryPath = join(baseDir, dirName);
		if (!existsSync(categoryPath)) continue;

		const files = await readdir(categoryPath, { recursive: false });
		const componentFiles = files.filter(
			(file) =>
				(file.endsWith(".tsx") || file.endsWith(".jsx")) &&
				!file.endsWith(".stories.tsx") &&
				!file.endsWith(".stories.jsx") &&
				!file.endsWith(".test.tsx") &&
				!file.endsWith(".test.jsx"),
		);

		componentsByCategory.set(category, componentFiles);
	}

	return componentsByCategory;
}

async function analyzeComponent(filePath: string): Promise<ComponentInfo> {
	const content = await readFile(filePath, "utf-8");
	const fileName = basename(filePath, extname(filePath));
	const category = basename(dirname(filePath));

	// Simple heuristics to detect component structure
	const hasPropsInterface = /interface\s+\w+Props/.test(content);
	const hasPropsType = /type\s+\w+Props/.test(content);
	const hasProps = hasPropsInterface || hasPropsType;

	const isDefaultExport = /export\s+default/.test(content);
	const hasNamedExport = new RegExp(
		`export\\s+(?:const|function)\\s+${fileName}`,
	).test(content);

	return {
		name: fileName,
		path: filePath,
		category: category.charAt(0).toUpperCase() + category.slice(1),
		hasProps,
		isDefaultExport: isDefaultExport && !hasNamedExport,
	};
}

function generateStoryContent(info: ComponentInfo): string {
	const importPath = `./${info.name}`;
	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
	const categoryTitle = capitalize(info.category);

	return `import type { Meta, StoryObj } from "@storybook/react";
import { ${info.name} } from "${importPath}";

const meta: Meta<typeof ${info.name}> = {
	title: "${categoryTitle}/${info.name}",
	component: ${info.name},
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ${info.name}>;

export const Default: Story = {
	render: () => <${info.name} />,
};
`;
}

async function generateStories() {
	const componentsDir = join(process.cwd(), "src", "components");
	const componentsByCategory = await getComponentFiles(componentsDir);

	let created = 0;
	let skipped = 0;

	for (const [category, files] of componentsByCategory) {
		for (const file of files) {
			const componentPath = join(componentsDir, category, file);
			const storyFileName = file.replace(/\.(tsx|jsx)$/, ".stories.tsx");
			const storyPath = join(componentsDir, category, storyFileName);

			// Skip if story already exists (unless --force flag is used)
			if (existsSync(storyPath) && !process.argv.includes("--force")) {
				console.log(
					`[SKIP] Skipping ${category}/${file} (story already exists)`,
				);
				skipped++;
				continue;
			}

			try {
				const componentInfo = await analyzeComponent(componentPath);
				const storyContent = generateStoryContent(componentInfo);

				await writeFile(storyPath, storyContent, "utf-8");
				console.log(`[OK] Created story for ${category}/${file}`);
				created++;
			} catch (error) {
				console.error(`[ERROR] Error processing ${category}/${file}:`, error);
			}
		}
	}

	console.log(
		`\n[STATS] Summary: ${created} created, ${skipped} skipped, ${created + skipped} total`,
	);
}

// Run the generator
generateStories().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});

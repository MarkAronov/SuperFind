import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";

interface ComponentInfo {
	name: string;
	path: string;
	category: string;
	hasProps: boolean;
	isDefaultExport: boolean;
	requiredProps: string[];
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

	// Extract required props (simple heuristic - props without ? or = default)
	const requiredProps: string[] = [];
	const propsMatch = content.match(/interface\s+\w+Props\s*{([^}]+)}/s) ||
		content.match(/type\s+\w+Props\s*=\s*{([^}]+)}/s);
	
	if (propsMatch) {
		const propsBody = propsMatch[1];
		const propLines = propsBody.split('\n').map(line => line.trim()).filter(Boolean);
		
		for (const line of propLines) {
			// Skip lines with optional (?) or default values, or comments
			if (line.startsWith('//') || line.startsWith('/*') || line.includes('?:') || line.includes('=')) {
				continue;
			}
			// Extract prop name from lines like "propName: Type;"
			const match = line.match(/^(\w+):/);
			if (match) {
				requiredProps.push(match[1]);
			}
		}
	}

	return {
		name: fileName,
		path: filePath,
		category: category.charAt(0).toUpperCase() + category.slice(1),
		hasProps,
		isDefaultExport: isDefaultExport && !hasNamedExport,
		requiredProps,
	};
}

function generateStoryContent(info: ComponentInfo): string {
	const importPath = `./${info.name}`;
	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
	const categoryTitle = capitalize(info.category);

	// Generate default props based on component name and required props
	const getDefaultPropsAndChildren = (): { props: string; children: string; hasChildren: boolean } => {
		if (info.requiredProps.length === 0) {
			return { props: "", children: "", hasChildren: false };
		}

		// Component-specific defaults
		const defaults: Record<string, Record<string, string>> = {
			ActionButton: {}, // children handled separately
			Hero: { title: `"Welcome"`, subtitle: `"This is a hero component"` },
			StatusBadge: { status: `"active"` },
			CodeBlock: { language: `"typescript"`, code: `"console.log('Hello, World!');"` },
			CTACard: { title: `"Get Started"`, description: `"Start using SkillVector today"` },
			ErrorMessage: { message: `"An error occurred"` },
			FeatureList: { features: `{["Feature 1", "Feature 2", "Feature 3"]}` },
			IconCard: { icon: `{<span>📦</span>}`, title: `"Icon Card"`, description: `"This is an icon card"` },
			PersonCard: { person: `{{ id: "1", name: "John Doe", title: "Software Engineer", skills: ["TypeScript", "React"], score: 0.95 }}` },
			SearchBar: { onSearch: `{() => {}}` },
			ViewToggle: { view: `"grid"`, onViewChange: `{() => {}}` },
			SearchResults: { data: `{{ results: [], totalCount: 0, query: "" }}` },
			PlaceholderPage: { title: `"Placeholder"` },
		};

		const componentDefaults = defaults[info.name] || {};
		
		// Check if component has children prop
		const hasChildrenProp = info.requiredProps.includes('children');
		const childrenContent = hasChildrenProp ? 'Click Me' : '';
		
		// Build props string (exclude children from props)
		const propParts: string[] = [];
		for (const prop of info.requiredProps) {
			if (prop === 'children') continue; // Handle children separately
			const defaultValue = componentDefaults[prop] || `{undefined}`;
			propParts.push(`${prop}=${defaultValue}`);
		}

		const propsString = propParts.length > 0 ? ` ${propParts.join(" ")}` : "";

		return { 
			props: propsString, 
			children: childrenContent,
			hasChildren: hasChildrenProp
		};
	};

	const { props, children, hasChildren } = getDefaultPropsAndChildren();
	
	const componentTag = hasChildren 
		? `<${info.name}${props}>${children}</${info.name}>`
		: `<${info.name}${props} />`;

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
	render: () => ${componentTag},
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

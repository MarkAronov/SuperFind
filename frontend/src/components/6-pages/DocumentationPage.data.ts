/**
 * Documentation Page Data
 * Code examples, SDK info, and installation commands for SDK documentation
 */

// SDK metadata for the overview section
export const sdkInfo = {
	description:
		"Official TypeScript/JavaScript client for the SkillVector API. Fully typed, lightweight, and designed for both Node.js and browser environments.",
	requirements: "Node.js 18+ or any modern browser with ES2020 support",
	repository: "https://github.com/MarkAronov/SkillVector",
} as const;

// Quick start snippet shown before the detailed examples
export const quickStartCode = `import { SkillVectorClient } from '@skillvector/sdk';

// Initialize the client
const client = new SkillVectorClient({
  baseUrl: 'https://api.skillvector.com',
});

// Perform a semantic search
const results = await client.search('TypeScript developer', 10, 0);
console.log(results);`;

export const packageManagers = [
	{ id: "npm", name: "npm", command: `npm install @skillvector/sdk` },
	{ id: "bun", name: "bun", command: `bun add @skillvector/sdk` },
	{ id: "yarn", name: "yarn", command: `yarn add @skillvector/sdk` },
	{ id: "pnpm", name: "pnpm", command: `pnpm add @skillvector/sdk` },
];

export const sdkExamples = [
	{
		id: "basic",
		title: "Basic Search",
		description: "Perform a simple search with query, limit, and offset:",
		code: `import { SkillVectorClient } from '@skillvector/sdk';

const client = new SkillVectorClient({
  baseUrl: 'https://api.skillvector.com'
});

const results = await client.search('TypeScript developer', 10, 0);
console.log(results);`,
	},
	{
		id: "filters",
		title: "Search with Filters",
		description: "Apply filters for skills, experience, and location:",
		code: `import { SkillVectorClient } from '@skillvector/sdk';

const client = new SkillVectorClient({
  baseUrl: 'https://api.skillvector.com'
});

const filtered = await client.searchWithFilters({
  query: 'Full Stack Engineer',
  filters: {
    skills: ['React', 'Node.js', 'TypeScript'],
    experience: { min: 3, max: 7 },
    location: ['Remote', 'New York']
  },
  limit: 20,
  offset: 0
});`,
	},
	{
		id: "pagination",
		title: "Pagination",
		description: "Handle paginated results across multiple requests:",
		code: `import { SkillVectorClient } from '@skillvector/sdk';

const client = new SkillVectorClient({
  baseUrl: 'https://api.skillvector.com'
});

// Fetch first page
const page1 = await client.search('Data Scientist', 20, 0);

// Fetch second page
const page2 = await client.search('Data Scientist', 20, 20);

// Fetch third page
const page3 = await client.search('Data Scientist', 20, 40);`,
	},
	{
		id: "error",
		title: "Error Handling",
		description: "Properly handle errors and implement retry logic:",
		code: `import { SkillVectorClient } from '@skillvector/sdk';

const client = new SkillVectorClient({
  baseUrl: 'https://api.skillvector.com',
  timeout: 5000,
  retries: 3
});

try {
  const results = await client.search('Python developer', 10, 0);
  console.log('Search successful:', results);
} catch (error) {
  if (error.response?.status === 404) {
    console.error('Resource not found');
  } else if (error.response?.status === 500) {
    console.error('Server error, please try again later');
  } else {
    console.error('An error occurred:', error.message);
  }
}`,
	},
	{
		id: "config",
		title: "Custom Configuration",
		description: "Configure client with custom timeout, retries, and headers:",
		code: `import { SkillVectorClient } from '@skillvector/sdk';

const client = new SkillVectorClient({
  baseUrl: 'https://api.skillvector.com',
  timeout: 10000,        // 10 second timeout
  retries: 5,            // Retry up to 5 times
  retryDelay: 1000,      // 1 second between retries
  headers: {
    'X-Custom-Header': 'value'
  }
});`,
	},
	{
		id: "batch",
		title: "Batch Operations",
		description: "Execute multiple search queries in parallel:",
		code: `import { SkillVectorClient } from '@skillvector/sdk';

const client = new SkillVectorClient({
  baseUrl: 'https://api.skillvector.com'
});

const queries = [
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Data Scientist'
];

const results = await Promise.all(
  queries.map(query => client.search(query, 10, 0))
);

results.forEach((result, index) => {
  console.log(\`Results for \${queries[index]}:\`, result.length);
});`,
	},
	{
		id: "complex",
		title: "Complex Filtering",
		description:
			"Advanced filtering with multiple criteria and post-processing:",
		code: `import { SkillVectorClient } from '@skillvector/sdk';

const client = new SkillVectorClient({
  baseUrl: 'https://api.skillvector.com'
});

const results = await client.searchWithFilters({
  query: 'Senior Software Engineer',
  filters: {
    skills: ['Kubernetes', 'AWS', 'Terraform', 'Python'],
    experience: { min: 5, max: 10 },
    location: ['Remote', 'San Francisco', 'Seattle'],
    education: ['Bachelor', 'Master'],
    certifications: ['AWS Certified', 'CKA']
  },
  limit: 50,
  offset: 0
});

// Sort by score
const sorted = results.sort((a, b) => b.score - a.score);

// Filter by minimum score threshold
const highQuality = sorted.filter(r => r.score > 0.8);`,
	},
	{
		id: "stream",
		title: "Streaming Results",
		description: "Stream large result sets using async generators:",
		code: `import { SkillVectorClient } from '@skillvector/sdk';

const client = new SkillVectorClient({
  baseUrl: 'https://api.skillvector.com'
});

async function* searchWithPagination(query: string, pageSize: number = 20) {
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const results = await client.search(query, pageSize, offset);

    if (results.length === 0) {
      hasMore = false;
      break;
    }

    yield results;
    offset += pageSize;

    if (results.length < pageSize) {
      hasMore = false;
    }
  }
}

// Usage
for await (const batch of searchWithPagination('ML Engineer', 50)) {
  console.log(\`Processing batch of \${batch.length} results\`);
  // Process each batch as it arrives
  batch.forEach(result => {
    console.log(result.name, result.score);
  });
}`,
	},
];

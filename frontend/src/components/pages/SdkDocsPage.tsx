import { Card } from "../atoms/Card";
import { CodeBlock } from "../molecules/CodeBlock";
import { PageTemplate } from "../templates/PageTemplate";

export const SdkDocsPage = () => {
	const install = `npm install @skillvector/sdk`;
	const quickUse = `import { SkillVectorClient } from '@skillvector/sdk';

(async () => {
  const client = new SkillVectorClient({ baseUrl: 'http://localhost:3000' });
  const results = await client.search('TypeScript developer', 10, 0);
  console.log(results);
})();`;

	return (
		<PageTemplate title="SDK">
			<div className="max-w-5xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">SDKs</h1>
					<p className="text-muted-foreground">
						TypeScript SDK for SkillVector — quick-start and examples
					</p>
				</div>
				<div className="grid gap-6">
					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-2">Install</h2>
						<CodeBlock language="bash" code={install} />
					</Card>

					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-2">Quick Start</h2>
						<CodeBlock language="ts" code={quickUse} />
					</Card>

					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-2">Features</h2>
						<ul className="list-disc pl-6">
							<li>Search & pagination helpers</li>
							<li>Filters support with `searchWithFilters`</li>
							<li>Retries and exponential backoff</li>
							<li>TypeScript types for strict typing</li>
						</ul>
					</Card>
				</div>
			</div>
		</PageTemplate>
	);
};
